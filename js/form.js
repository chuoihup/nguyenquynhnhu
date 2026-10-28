

const ContactForm = (() => {
  
  function showError(fieldId, errorId, message) {
    const field = Utils.getById(fieldId);
    const error = Utils.getById(errorId);
    if (field) {
      field.classList.remove('is-valid');
      field.classList.add('has-error');
    }
    if (error) error.textContent = message;
  }

  function showValid(fieldId, errorId) {
    const field = Utils.getById(fieldId);
    const error = Utils.getById(errorId);
    if (field) {
      field.classList.remove('has-error');
      field.classList.add('is-valid');
    }
    if (error) error.textContent = '';
  }

  function validate() {
    let isValid = true;

    const name = Utils.getById('form-name');
    if (!name || name.value.trim().length < 2) {
      showError('form-name', 'err-name', 'Vui long nhap ho va ten (it nhat 2 ky tu)');
      isValid = false;
    } else {
      showValid('form-name', 'err-name');
    }

    const email = Utils.getById('form-email');
    if (!email || !Utils.isValidEmail(email.value)) {
      showError('form-email', 'err-email', 'Email chua hop le (VD: name@example.com)');
      isValid = false;
    } else {
      showValid('form-email', 'err-email');
    }

    const msg = Utils.getById('form-msg');
    if (!msg || msg.value.trim().length < 10) {
      showError('form-msg', 'err-msg', 'Noi dung phai co it nhat 10 ky tu');
      isValid = false;
    } else {
      showValid('form-msg', 'err-msg');
    }

    return isValid;
  }

  
  function init() {
    const form      = Utils.getById('contact-form');
    const submitBtn = Utils.getById('form-submit');
    const successEl = Utils.getById('contact-success');
    if (!form) return;

    
    ['form-name', 'form-email', 'form-msg'].forEach(id => {
      const el = Utils.getById(id);
      el && el.addEventListener('blur', validate);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      
      if (submitBtn) {
        submitBtn.disabled = true;
        const textEl    = submitBtn.querySelector('.btn__text');
        const loadingEl = submitBtn.querySelector('.btn__loading');
        if (textEl)    textEl.hidden    = true;
        if (loadingEl) loadingEl.hidden = false;
      }

      
      setTimeout(() => {
        form.hidden = true;
        if (successEl) successEl.removeAttribute('hidden');
      }, 1500);
    });
  }

  return { init };
})();
