/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — contact.js
   Logica formularului de contact.

   Comportament:
   • Pe host cu PHP  → obține token CSRF din php/contact.php,
     trimite real prin fetch() și afișează răspunsul serverului.
   • Fără PHP (ex. GitHub Pages) → detectează absența backend-ului
     și simulează succesul, ca site-ul static să rămână funcțional.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var ENDPOINT = 'php/contact.php';
  var success = document.getElementById('formSuccess');
  var submitBtn = form.querySelector('.form-submit');
  var csrfInput = document.getElementById('fcsrf');
  var formDirty = false;
  var hasBackend = false; // devine true dacă obținem un token CSRF valid

  /* ── Încearcă să obții tokenul CSRF (detectează backend-ul) ── */
  fetch(ENDPOINT, { method: 'GET', headers: { 'Accept': 'application/json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data && data.csrf) {
        hasBackend = true;
        if (csrfInput) csrfInput.value = data.csrf;
      }
    })
    .catch(function () { /* fără backend — rămânem pe simulare */ });

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

  /* ── Stare buton ───────────────────────────────────── */
  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.textContent = on ? 'Se trimite...' : 'Trimite mesajul →';
  }

  function showSuccess() {
    formDirty = false;
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
  }

  /* ── SUBMIT ────────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Honeypot: dacă e completat, e bot — ne prefacem că a mers */
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

    setLoading(true);

    /* ── Fără backend: simulare (site static) ── */
    if (!hasBackend) {
      setTimeout(function () {
        setLoading(false);
        showSuccess();
      }, 600);
      return;
    }

    /* ── Cu backend: trimitere reală ── */
    fetch(ENDPOINT, {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        setLoading(false);
        if (res && res.success) {
          showSuccess();
        } else {
          alert(res && res.message ? res.message : 'A apărut o eroare. Încearcă din nou.');
        }
      })
      .catch(function () {
        setLoading(false);
        alert('Nu am putut trimite mesajul. Verifică conexiunea și încearcă din nou.');
      });
  });

  /* ── AVERTISMENT LA PĂRĂSIREA PAGINII ──────────────── */
  window.addEventListener('beforeunload', function (e) {
    if (formDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();
