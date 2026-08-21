<?php
/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO DEV — php/config.php
   Configurare centralizată pentru formularul de contact.
   Nu se accesează direct — doar inclus din contact.php.
   ═══════════════════════════════════════════════════════ */

if (!defined('APP')) { die(); }

/* ── DESTINATAR ────────────────────────────────────────
   Adresa unde ajung mesajele din formular. */
define('MAIL_TO',      'contact@signastudiodev.ro');
define('MAIL_SUBJECT', 'Mesaj nou de pe signastudiodev.ro');

/* Expeditorul tehnic. Trebuie să fie pe domeniul propriu,
   altfel mesajele ajung în spam (SPF/DKIM). */
define('MAIL_FROM',      'noreply@signastudiodev.ro');
define('MAIL_FROM_NAME', 'Signa Studio Dev');

/* ── MEDIU ─────────────────────────────────────────────
   true  = dezvoltare (erorile se afișează pe ecran)
   false = producție   (erorile doar în log intern)
   IMPORTANT: pune false înainte de a urca pe server. */
define('DEV_MODE', false);

/* ── LIMITE CÂMPURI (validare hard, server-side) ─────── */
define('MAX_NAME',    100);
define('MAX_EMAIL',   150);
define('MAX_PHONE',    30);
define('MAX_SUBJECT', 150);
define('MAX_SERVICE',  80);
define('MAX_MESSAGE', 2000);

/* ── RATE LIMITING ─────────────────────────────────────
   Maxim MAX_SUBMISSIONS trimiteri per IP în RATE_WINDOW secunde. */
define('MAX_SUBMISSIONS', 5);
define('RATE_WINDOW',     3600);          // 1 oră
define('TMP_DIR',         __DIR__ . '/tmp');
define('ERROR_LOG',       __DIR__ . '/tmp/error.log');

/* ── SERVICII ACCEPTATE ────────────────────────────────
   Whitelist — orice altă valoare e respinsă. */
$ALLOWED_SERVICES = [
    'Site de prezentare',
    'Magazin online',
    'Aplicație custom',
    'Nu știu încă / Altceva',
];
