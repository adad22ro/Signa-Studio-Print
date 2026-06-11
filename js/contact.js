/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — contact.js
   Logica formularului de contact.
   NOTĂ: Trimiterea reală necesită php/contact.php pe un
   host cu PHP. Momentan simulează succesul (vezi Pasul B).
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var success = document.getElementById('formSuccess');
  var submitBtn = form.querySelector('.form-submit');
  var formDirty = false;

  /* ── VALIDARE CÂMP ─────────────────────────────────── */
  function validateField(field) {
    if (!field.hasAttribute('required') && field.type !== 'email') return true;
    var valid = true;
    var val = field.value.trim();

    if (field.hasAttribute('required') && val === '') valid = false;
    if (field.type === 'email' && val !== '') {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }

    field.classList.toggle('form-input--error', !valid);
    return valid;
  }

  /* ── VALIDARE PE BLUR ──────────────────────────────── */
  form.querySelectorAll('.form-input, .form-textarea').forEach(function (field) {
    field.addEventListener('blur', function () {
      validateField(field);
    });
    field.addEventListener('input', function () {
      if (field.value.trim() !== '') formDirty = true;
      if (field.classList.contains('form-input--error')) {
        validateField(field);
      }
    });
  });

  /* ── SUBMIT ────────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Honeypot: dacă e completat, e bot — ne prefacem că a mers, dar nu trimitem */
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value !== '') {
      return;
    }

    /* Validare finală a câmpurilor obligatorii */
    var allValid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) {
      var firstError = form.querySelector('.form-input--error');
      if (firstError) firstError.focus();
      return;
    }

    /* Stare loading pe buton */
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Se trimite...';
    }

    /* ── SIMULARE (până la host cu PHP) ──
       Când vei avea host, aici se va înlocui cu un fetch()
       către php/contact.php. Vezi Pasul B. */
    setTimeout(function () {
      formDirty = false;
      if (form) form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 600);
  });

  /* ── AVERTISMENT LA PĂRĂSIREA PAGINII ──────────────── */
  window.addEventListener('beforeunload', function (e) {
    if (formDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();
