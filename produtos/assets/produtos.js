const PLENA_WHATSAPP = '5512992191018';
function openProductWhatsApp(message, source) {
  const tagged = `${message}\n\nOrigem: vim pelo site da Plena${source ? ' - ' + source : ''}.`;
  window.open(`https://wa.me/${PLENA_WHATSAPP}?text=${encodeURIComponent(tagged)}`, '_blank', 'noopener,noreferrer');
}
