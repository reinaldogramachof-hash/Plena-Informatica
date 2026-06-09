const PLENA_WHATSAPP = "5512992191018";

function openTemplateWhatsApp(message, templateName) {
  const source = `Origem: vim pelo site da Plena. Modelo: ${templateName}.`;
  const fullMessage = `${message}\n\n${source}`;
  const url = `https://wa.me/${PLENA_WHATSAPP}?text=${encodeURIComponent(fullMessage)}`;
  window.open(url, "_blank", "noopener");
}

const form = document.getElementById("diagnostic-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const business = String(data.get("business") || "").trim();
    const goal = String(data.get("goal") || "").trim();

    const message = [
      "Olá! Vim pelo site da Plena e gostaria de solicitar um diagnóstico para minha landing page ou projeto digital.",
      name ? `Nome: ${name}` : "",
      business ? `Tipo de negocio: ${business}` : "",
      goal ? `Objetivo: ${goal}` : ""
    ].filter(Boolean).join("\n");

    openTemplateWhatsApp(message, "Diagnóstico WhatsApp");
  });
}
