/* ═══════════════════════════════════════════════════════
   SIGNA STUDIO PRINT — contact.js
   Logica formularului de contact
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  window.submitForm = function (e) {
    e.preventDefault();
    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
  };

})();
