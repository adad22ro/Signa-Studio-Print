/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO DEV — js/form.js
   Handler partajat pentru formularul de contact, folosit
   atât pe pagina principală cât și pe contact.html.

   Validare pe blur + la submit, token CSRF luat de la
   server, trimitere AJAX către php/contact.php, stare de
   loading pe buton, mesaje din răspunsul serverului și
   confirmare la părăsirea paginii cu formularul completat.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var ENDPOINT = 'php/contact.php';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var success   = document.getElementById('formSuccess');
  var errorBox  = document.getElementById('formError');
  var submitBtn = form.querySelector('.form__submit, .form-submit');
  var csrfInput = form.querySelector('[name="csrf_token"]');
  var btnLabel  = submitBtn ? submitBtn.textContent.trim() : 'Trimite';
  var formDirty = false;

  /* ── TOKEN CSRF ────────────────────────────────────────
     Fără el, serverul respinge trimiterea cu 403. */
  function loadToken() {
    return fetch(ENDPOINT, {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (data && data.token && csrfInput) csrfInput.value = data.token;
      })
      .catch(function () {
        /* Backend indisponibil (ex. previzualizare fără PHP).
           Formularul rămâne vizibil, dar va raporta eroare la submit. */
      });
  }
  loadToken();

  /* ── MESAJE ────────────────────────────────────────────*/
  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.classList.add('is-visible');
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.classList.remove('is-visible');
  }

  function setFieldMsg(field, msg) {
    var el = form.querySelector('.field__msg[data-for="' + field.id + '"]');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('is-visible', !!msg);
  }

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.textContent = on ? 'Se trimite...' : btnLabel;
  }

  /* ── VALIDARE ──────────────────────────────────────────*/
  function validateField(field) {
    var val = field.value.trim();
    var msg = '';

    if (field.hasAttribute('required') && val === '') {
      /* Selectul cere o alegere, nu o completare — altfel mesajul sună greșit. */
      msg = field.tagName === 'SELECT'
        ? 'Alege tipul de proiect.'
        : 'Câmpul este obligatoriu.';
    } else if (field.type === 'email' && val !== '' &&
               !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Adresa de email nu pare validă.';
    } else if (field.name === 'phone' && val !== '' &&
               !/^[0-9+\s().-]{6,30}$/.test(val)) {
      msg = 'Numărul de telefon nu pare valid.';
    } else if (field.name === 'message' && val !== '' && val.length < 10) {
      msg = 'Scrie cel puțin 10 caractere.';
    }

    var valid = msg === '';
    field.classList.toggle('is-invalid', !valid);
    field.setAttribute('aria-invalid', valid ? 'false' : 'true');
    setFieldMsg(field, msg);
    return valid;
  }

  form.querySelectorAll('.field__input, .form-input, .form-textarea').forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('change', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.value.trim() !== '') formDirty = true;
      if (field.classList.contains('is-invalid')) validateField(field);
    });
  });

  /* ── SUBMIT ────────────────────────────────────────────*/
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    /* Honeypot: completat = bot. Nu trimitem, dar nu semnalăm. */
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value !== '') return;

    var allValid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) {
      var first = form.querySelector('.is-invalid');
      if (first) {
        /* Pe mobil, formularul e lung și câmpul greșit poate fi mult
           deasupra: aducem întâi câmpul pe ecran, apoi îi dăm focus. */
        first.scrollIntoView({ block: 'center', behavior: 'smooth' });
        first.focus({ preventScroll: true });
      }
      showError('Verifică câmpurile marcate și încearcă din nou.');
      return;
    }

    setLoading(true);

    fetch(ENDPOINT, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success) {
          formDirty = false;
          form.classList.add('is-hidden');
          if (success) {
            success.classList.add('is-visible');
            var h = success.querySelector('h3, h4');
            if (h) h.focus();
          }
        } else {
          setLoading(false);
          showError((data && data.message) || 'Mesajul nu a putut fi trimis.');
          loadToken();   /* token consumat — cerem unul nou */
        }
      })
      .catch(function () {
        setLoading(false);
        showError('Conexiune eșuată. Scrie-ne direct la contact@signastudiodev.ro.');
      });
  });

  /* ── AVERTISMENT LA PĂRĂSIREA PAGINII ──────────────────*/
  window.addEventListener('beforeunload', function (e) {
    if (formDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

})();
