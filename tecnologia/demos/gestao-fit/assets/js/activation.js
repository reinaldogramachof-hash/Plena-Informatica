/* A ativação verifica a identidade do produto; não contém atalhos de licença. */
window.activateLicense = async event => {
    event?.preventDefault();
    const button=document.getElementById('btn-activate'),output=document.getElementById('activation-error');
    const key=document.getElementById('license-key').value.trim(),email=document.getElementById('license-email').value.trim();
    if(!key||!email)return;
    button.disabled=true;button.textContent='Verificando...';output.classList.add('hidden');
    try{await FitLicense.activate(key,email);document.getElementById('license-key').value='';}
    catch(error){output.textContent=error.message;output.classList.remove('hidden');}
    finally{button.disabled=false;button.textContent='Ativar Sistema';}
};
window.confirmReceipt = async () => {
    const button=document.getElementById('btn-confirm-receipt');button.disabled=true;button.textContent='Registrando...';
    try{await FitLicense.confirmReceipt();}
    catch(error){alert(error.message);}
    finally{button.disabled=false;button.textContent='Confirmar Recebimento e Acesso';}
};
