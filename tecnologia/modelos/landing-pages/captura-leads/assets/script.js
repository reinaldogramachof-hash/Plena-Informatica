const PLENA_WHATSAPP = "5512992191018";

function openLeadWhatsApp(message, templateName) {
  const source = `Origem: vim pelo site da Plena. Modelo: ${templateName}.`;
  const fullMessage = `${message}\n\n${source}`;
  const url = `https://wa.me/${PLENA_WHATSAPP}?text=${encodeURIComponent(fullMessage)}`;
  window.open(url, "_blank", "noopener");
}

function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length > 6) {
    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  }

  if (digits.length > 2) {
    return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  return digits;
}

const phoneInput = document.getElementById("lead-phone");
const form = document.getElementById("lead-form");
const successModal = document.getElementById("success-modal");

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = maskPhone(phoneInput.value);
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = document.getElementById("submit-btn");
    if (submitButton) {
      submitButton.textContent = "Solicitacao registrada";
      submitButton.disabled = true;
    }

    if (successModal) {
      successModal.hidden = false;
    }

    setTimeout(() => {
      if (submitButton) {
        submitButton.textContent = "Receber material";
        submitButton.disabled = false;
      }
      form.reset();
    }, 900);
  });
}

function closeSuccess() {
  if (successModal) {
    successModal.hidden = true;
  }
}
