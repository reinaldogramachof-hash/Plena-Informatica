function initSorveteriaLoyalty() {
    const settings=document.createElement('div');settings.className='bg-white rounded-xl border p-6 space-y-4';settings.id='loyalty-settings';
    settings.innerHTML=`<h3 class="font-bold text-lg">Fidelidade e resgate de pontos</h3><p class="text-sm text-gray-500">Defina o benefício antes de ativar. Os saldos já registrados são preservados.</p>
    <form onsubmit="saveLoyaltySettings(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <label class="text-sm">Valor em compras para ganhar 1 ponto (R$)<input id="loyalty-earn-every" type="number" min="0.01" step="0.01" required class="w-full border p-2 rounded-lg mt-1"></label>
    <label class="text-sm">Desconto por ponto (R$)<input id="loyalty-point-value" type="number" min="0.01" step="0.01" class="w-full border p-2 rounded-lg mt-1"></label>
    <label class="text-sm">Limite de desconto da compra (%)<input id="loyalty-max-percent" type="number" min="1" max="100" step="1" class="w-full border p-2 rounded-lg mt-1"></label>
    <label class="md:col-span-3 text-sm flex gap-2 items-center"><input id="loyalty-enabled" type="checkbox">Ativar acúmulo e resgate de pontos</label><button class="px-4 py-3 bg-brand-primary text-white rounded-lg font-bold" type="submit">Salvar fidelidade</button></form>
    <p class="text-xs text-gray-500">O limite é aplicado ao valor após o desconto manual. Cancelamentos devolvem os pontos usados e retiram os pontos ganhos; se já foram usados, o saldo pode ficar devedor e será compensado nas próximas compras.</p>`;
    document.getElementById('view-settings').appendChild(settings);
    const field=document.createElement('div');field.id='pdv-loyalty';field.className='border rounded-lg p-3 space-y-2';
    field.innerHTML='<label class="block text-sm font-bold" for="pdv-loyalty-points">Usar pontos do cliente</label><p id="pdv-loyalty-balance" class="text-xs text-gray-500"></p><input id="pdv-loyalty-points" type="number" min="0" step="1" value="0" oninput="renderCartTotals()" class="w-full border p-2 rounded-lg"><p id="pdv-loyalty-result" class="text-sm"></p>';
    document.getElementById('checkout-btn').before(field);
    document.getElementById('customer-select').addEventListener('change',()=>{document.getElementById('pdv-loyalty-points').value='0';renderCartTotals();});
    renderLoyaltySettings();renderCartTotals();
}
function renderLoyaltySettings() {
    const rule=db.settings.loyalty||{};
    if(!document.getElementById('loyalty-enabled'))return;
    document.getElementById('loyalty-enabled').checked=!!rule.enabled;
    document.getElementById('loyalty-earn-every').value=rule.earnEvery??10;
    document.getElementById('loyalty-point-value').value=rule.pointValue||'';
    document.getElementById('loyalty-max-percent').value=rule.maxDiscountPercent||'';
}
function saveLoyaltySettings(event) {
    event.preventDefault();
    const enabled=document.getElementById('loyalty-enabled').checked;
    const earnEvery=Number(document.getElementById('loyalty-earn-every').value),pointValue=Number(document.getElementById('loyalty-point-value').value),maxDiscountPercent=Number(document.getElementById('loyalty-max-percent').value);
    if(!Number.isFinite(earnEvery)||earnEvery<=0||(enabled&&(!Number.isFinite(pointValue)||roundMoney(pointValue)<=0||!Number.isInteger(maxDiscountPercent)||maxDiscountPercent<=0||maxDiscountPercent>100))){showNotification('Defina ganho, valor do ponto e limite de desconto antes de ativar.', 'error');return;}
    const next=JSON.parse(JSON.stringify(db));next.settings.loyalty={enabled,earnEvery,pointValue:roundMoney(pointValue),maxDiscountPercent};
    try{persistDatabase(next);renderCartTotals();showNotification('Fidelidade atualizada. Os saldos dos clientes foram preservados.','success');}catch(error){showNotification(error.message,'error');}
}
function pdvLoyaltyAmounts(subtotal,manualDiscount,strict=false) {
    const clientId=document.getElementById('customer-select')?.value||'';
    const requested=document.getElementById('pdv-loyalty-points')?.value||0;
    const rule=db.settings.loyalty||{};
    const client=db.clients.find(client=>client.id===clientId);
    const field=document.getElementById('pdv-loyalty');
    if(field){
        field.classList.toggle('hidden',!rule.enabled);
        document.getElementById('pdv-loyalty-balance').textContent=client?`Saldo: ${Number(client.points||0)} ponto(s). Cada ponto vale ${fmtMoney(Number(rule.pointValue||0))}.`:'Selecione um cliente no pedido para resgatar.';
    }
    try{
        const result=getLoyaltyRedemption(db,clientId,requested,subtotal,manualDiscount);
        if(field)document.getElementById('pdv-loyalty-result').textContent=result.discount?`Desconto de pontos: ${fmtMoney(result.discount)}`:'';
        return result;
    }catch(error){
        if(strict)throw error;
        if(field)document.getElementById('pdv-loyalty-result').textContent=error.message;
        return{points:0,discount:0};
    }
}
