<?php
/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — php/contact.php
   Procesare formular de contact.

   GET   → emite un token CSRF  { success:true, token:"..." }
   POST  → validează și trimite { success:bool, message:"..." }

   Securitate: doar POST pentru trimitere, honeypot, token CSRF
   din sesiune, sanitizare + validare server-side independentă
   de JS, limite hard pe câmpuri, rate limiting 5/oră per IP.
   ═══════════════════════════════════════════════════════ */

define('APP', true);
require_once __DIR__ . '/config.php';

/* ── REGIM DE ERORI ────────────────────────────────────
   În producție nu se afișează nimic pe ecran; totul în log intern. */
if (DEV_MODE) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(0);
}
ini_set('log_errors', '1');
ini_set('error_log', ERROR_LOG);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/* Sesiune cu cookie restrictiv (pentru tokenul CSRF) */
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'httponly' => true,
    'samesite' => 'Strict',
    'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);
session_start();

/* ═══ FUNCȚII AJUTĂTOARE ═══════════════════════════════ */

function respond($success, $message, $extra = []) {
    echo json_encode(
        array_merge(['success' => $success, 'message' => $message], $extra),
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

function client_ip() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/* Curăță un câmp: trim + elimină slash-uri + escapează HTML */
function clean($value, $maxLen) {
    $value = is_string($value) ? $value : '';
    $value = trim($value);
    $value = stripslashes($value);
    /* Taie caracterele de control (inclusiv injecție de anteturi email) */
    $value = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value);
    $value = mb_substr($value, 0, $maxLen, 'UTF-8');
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/* ── RATE LIMITING ─────────────────────────────────────
   Se numără doar TRIMITERILE REUȘITE, nu și încercările respinse
   la validare — altfel cineva care greșește emailul de câteva ori
   ar rămâne blocat o oră degeaba. */

function rate_file($ip) {
    if (!is_dir(TMP_DIR)) {
        @mkdir(TMP_DIR, 0700, true);
    }
    return TMP_DIR . '/rate_' . hash('sha256', $ip) . '.json';
}

/* Citește trimiterile din fereastra curentă */
function rate_hits($ip) {
    $file = rate_file($ip);
    $now  = time();

    $hits = [];
    if (is_readable($file)) {
        $raw  = @file_get_contents($file);
        $data = json_decode((string)$raw, true);
        if (is_array($data)) { $hits = $data; }
    }

    return array_values(array_filter($hits, function ($t) use ($now) {
        return is_int($t) && ($now - $t) < RATE_WINDOW;
    }));
}

/* Verifică limita — fără să consume o unitate */
function rate_limit_ok($ip) {
    return count(rate_hits($ip)) < MAX_SUBMISSIONS;
}

/* Înregistrează o trimitere reușită */
function rate_limit_record($ip) {
    $hits   = rate_hits($ip);
    $hits[] = time();
    @file_put_contents(rate_file($ip), json_encode($hits), LOCK_EX);
}

/* ═══ GET — EMITERE TOKEN CSRF ═════════════════════════ */

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    respond(true, 'Token emis.', ['token' => $_SESSION['csrf_token']]);
}

/* ═══ ORICE ALTCEVA DECÂT POST ═════════════════════════ */

if ($method !== 'POST') {
    http_response_code(405);
    header('Allow: GET, POST');
    respond(false, 'Metodă nepermisă.');
}

/* ═══ POST — PROCESARE ═════════════════════════════════ */

/* 1. Honeypot — completat doar de boți. Răspundem cu succes fals,
      ca botul să nu învețe că a fost detectat. */
if (!empty($_POST['website'])) {
    respond(true, 'Mesaj trimis. Mulțumim!');
}

/* 2. Token CSRF */
$token = $_POST['csrf_token'] ?? '';
if (empty($_SESSION['csrf_token']) || !is_string($token)
    || !hash_equals($_SESSION['csrf_token'], $token)) {
    http_response_code(403);
    respond(false, 'Sesiune expirată. Reîmprospătează pagina și încearcă din nou.');
}

/* 3. Rate limiting */
$ip = client_ip();
if (!rate_limit_ok($ip)) {
    http_response_code(429);
    respond(false, 'Ai trimis prea multe mesaje. Încearcă din nou peste o oră sau sună-ne direct.');
}

/* 4. Sanitizare */
$name    = clean($_POST['name']    ?? '', MAX_NAME);
$email   = clean($_POST['email']   ?? '', MAX_EMAIL);
$phone   = clean($_POST['phone']   ?? '', MAX_PHONE);
$subject = clean($_POST['subject'] ?? '', MAX_SUBJECT);
$service = clean($_POST['service'] ?? '', MAX_SERVICE);
$message = clean($_POST['message'] ?? '', MAX_MESSAGE);

/* 5. Validare server-side — independentă de JS */
$errors = [];

if (mb_strlen($name, 'UTF-8') < 2) {
    $errors[] = 'Numele trebuie să aibă cel puțin 2 caractere.';
}
if ($email === '' || !filter_var(html_entity_decode($email, ENT_QUOTES, 'UTF-8'), FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Adresa de email nu este validă.';
}
if ($phone !== '' && !preg_match('/^[0-9+\s().\-]{6,30}$/', html_entity_decode($phone, ENT_QUOTES, 'UTF-8'))) {
    $errors[] = 'Numărul de telefon nu este valid.';
}
if (mb_strlen($message, 'UTF-8') < 10) {
    $errors[] = 'Mesajul trebuie să aibă cel puțin 10 caractere.';
}
if ($service !== '' && !in_array(html_entity_decode($service, ENT_QUOTES, 'UTF-8'), $ALLOWED_SERVICES, true)) {
    $service = 'Nespecificat';
}

if ($errors) {
    http_response_code(422);
    respond(false, implode(' ', $errors));
}

/* 6. Compunere email — multipart (text + HTML) */
$replyTo  = html_entity_decode($email, ENT_QUOTES, 'UTF-8');
$safeSubj = $subject !== '' ? $subject : '(fără subiect)';
$boundary = '=_' . bin2hex(random_bytes(16));

$rows = [
    'Nume'       => $name,
    'Email'      => $email,
    'Telefon'    => $phone !== '' ? $phone : '—',
    'Subiect'    => $safeSubj,
    'Serviciu'   => $service !== '' ? $service : '—',
    'IP'         => $ip,
    'Data'       => date('d.m.Y H:i:s'),
];

$textBody = "MESAJ NOU DE PE SIGNASTUDIOPRINT.RO\n"
          . str_repeat('=', 40) . "\n\n";
foreach ($rows as $k => $v) {
    $textBody .= str_pad($k . ':', 12) . html_entity_decode($v, ENT_QUOTES, 'UTF-8') . "\n";
}
$textBody .= "\nMesaj:\n" . html_entity_decode($message, ENT_QUOTES, 'UTF-8') . "\n";

$htmlRows = '';
foreach ($rows as $k => $v) {
    $htmlRows .= '<tr>'
              .  '<td style="padding:6px 12px;background:#f5f5f5;font-weight:600;white-space:nowrap">' . $k . '</td>'
              .  '<td style="padding:6px 12px">' . $v . '</td>'
              .  '</tr>';
}
$htmlBody = '<!DOCTYPE html><html lang="ro"><head><meta charset="UTF-8"></head>'
          . '<body style="font-family:Arial,Helvetica,sans-serif;color:#101010">'
          . '<h2 style="margin:0 0 16px">Mesaj nou de pe signastudioprint.ro</h2>'
          . '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">'
          . $htmlRows . '</table>'
          . '<h3 style="margin:20px 0 8px">Mesaj</h3>'
          . '<div style="font-size:14px;line-height:1.6;white-space:pre-wrap;'
          . 'padding:12px;background:#f5f5f5;border-radius:6px">' . $message . '</div>'
          . '</body></html>';

$body = "--$boundary\r\n"
      . "Content-Type: text/plain; charset=UTF-8\r\n"
      . "Content-Transfer-Encoding: 8bit\r\n\r\n"
      . $textBody . "\r\n"
      . "--$boundary\r\n"
      . "Content-Type: text/html; charset=UTF-8\r\n"
      . "Content-Transfer-Encoding: 8bit\r\n\r\n"
      . $htmlBody . "\r\n"
      . "--$boundary--";

$headers  = 'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . ">\r\n"
          . 'Reply-To: ' . $replyTo . "\r\n"
          . "MIME-Version: 1.0\r\n"
          . "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n"
          . 'X-Mailer: PHP/' . phpversion();

$mailSubject = '=?UTF-8?B?' . base64_encode(MAIL_SUBJECT . ' — ' . html_entity_decode($safeSubj, ENT_QUOTES, 'UTF-8')) . '?=';

/* 7. Trimitere */
$sent = @mail(MAIL_TO, $mailSubject, $body, $headers, '-f' . MAIL_FROM);

if (!$sent) {
    error_log('[contact] Trimitere esuata catre ' . MAIL_TO . ' de la IP ' . $ip);
    http_response_code(500);
    respond(false, 'Mesajul nu a putut fi trimis. Scrie-ne direct la ' . MAIL_TO . '.');
}

/* Trimitere reușită — abia acum se consumă o unitate din limită */
rate_limit_record($ip);

/* Token consumat — se regenerează pentru trimiterea următoare */
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

respond(true, 'Mesaj trimis. Te contactăm în cel mult 24 de ore.');
