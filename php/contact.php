<?php
/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — contact.php
   Procesare formular de contact: CSRF, honeypot, rate
   limiting, sanitizare, validare server-side, mail().

   NOTĂ REBRANDING: schimbă doar constantele de mai jos.
   ═══════════════════════════════════════════════════════ */

/* ── Configurare (ajustează la rebranding) ─────────────── */
const CONTACT_EMAIL = 'contact@signastudioprint.ro';   // unde ajung mesajele
const SITE_NAME     = 'Signa Studio Print';
const MAX_PER_HOUR  = 5;                                // trimiteri / IP / oră
const MSG_MAX_LEN   = 2000;

/* ── Producție: ascunde erorile de la vizitatori ───────── */
ini_set('display_errors', '0');
error_reporting(0);

session_start();
header('Content-Type: application/json; charset=utf-8');

/* ── Helper răspuns JSON ───────────────────────────────── */
function respond($success, $message) {
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

/* ═══ GET: livrează un token CSRF pentru formular ════════ */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    echo json_encode(['csrf' => $_SESSION['csrf']]);
    exit;
}

/* ═══ Doar POST dincolo de acest punct ══════════════════ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Metodă nepermisă.');
}

/* ── Honeypot: câmp ascuns completat = bot ─────────────── */
if (!empty($_POST['website'])) {
    respond(true, 'Mesaj trimis!'); // ne prefacem că a mers
}

/* ── Verificare token CSRF ─────────────────────────────── */
$token = $_POST['csrf'] ?? '';
if (empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $token)) {
    http_response_code(403);
    respond(false, 'Sesiune expirată. Reîncarcă pagina și încearcă din nou.');
}

/* ── Rate limiting: max MAX_PER_HOUR / IP / oră ────────── */
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$tmpDir  = __DIR__ . '/tmp';
if (!is_dir($tmpDir)) { @mkdir($tmpDir, 0755, true); }
$rateFile = $tmpDir . '/rate_' . md5($ip) . '.json';
$now      = time();
$hits     = [];
if (is_file($rateFile)) {
    $decoded = json_decode(file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $hits = array_filter($decoded, function ($t) use ($now) {
            return ($now - $t) < 3600;
        });
    }
}
if (count($hits) >= MAX_PER_HOUR) {
    http_response_code(429);
    respond(false, 'Ai trimis prea multe mesaje. Încearcă din nou peste o oră.');
}

/* ── Sanitizare + colectare câmpuri ────────────────────── */
function clean($key) {
    $v = $_POST[$key] ?? '';
    $v = trim($v);
    $v = stripslashes($v);
    return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}

$name    = clean('name');
$email   = clean('email');
$phone   = clean('phone');
$subject = clean('subject');
$service = clean('service');
$message = clean('message');

/* ── Validare server-side (independentă de JS) ─────────── */
$errors = [];
if ($name === '')                                        $errors[] = 'nume';
if ($email === '' || !filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($message === '')                                     $errors[] = 'mesaj';
if (mb_strlen($message) > MSG_MAX_LEN)                    $errors[] = 'mesaj prea lung';

if (!empty($errors)) {
    http_response_code(422);
    respond(false, 'Verifică datele introduse: ' . implode(', ', $errors) . '.');
}

/* ── Compunere email multipart (HTML + text) ───────────── */
$boundary = md5(uniqid((string)$now, true));
$to       = CONTACT_EMAIL;
$mailSubj = '[' . SITE_NAME . '] Mesaj nou' . ($subject !== '' ? ': ' . $subject : '');

$textBody = "Nume: $name\n"
          . "Email: $email\n"
          . "Telefon: $phone\n"
          . "Subiect: $subject\n"
          . "Serviciu: $service\n\n"
          . "Mesaj:\n$message\n";

$htmlBody = "<h2>Mesaj nou de pe " . SITE_NAME . "</h2>"
          . "<p><strong>Nume:</strong> $name</p>"
          . "<p><strong>Email:</strong> $email</p>"
          . "<p><strong>Telefon:</strong> " . ($phone !== '' ? $phone : '—') . "</p>"
          . "<p><strong>Subiect:</strong> " . ($subject !== '' ? $subject : '—') . "</p>"
          . "<p><strong>Serviciu:</strong> " . ($service !== '' ? $service : '—') . "</p>"
          . "<p><strong>Mesaj:</strong><br>" . nl2br($message) . "</p>";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "From: " . SITE_NAME . " <" . CONTACT_EMAIL . ">\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";

$body  = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n$textBody\r\n";
$body .= "--$boundary\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n\r\n$htmlBody\r\n";
$body .= "--$boundary--";

/* ── Trimitere ─────────────────────────────────────────── */
$sent = mail($to, $mailSubj, $body, $headers);

if (!$sent) {
    http_response_code(500);
    respond(false, 'Nu am putut trimite mesajul. Încearcă din nou sau scrie-ne direct pe email.');
}

/* ── Înregistrează trimiterea pentru rate limiting ─────── */
$hits[] = $now;
@file_put_contents($rateFile, json_encode(array_values($hits)));

respond(true, 'Mulțumim! Mesajul a fost trimis. Te contactăm în cel mult 24 de ore.');
