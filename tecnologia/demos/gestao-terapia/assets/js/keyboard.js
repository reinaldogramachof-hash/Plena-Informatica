/* Teclado compartilhado: usa as ações existentes, sem gravar dados diretamente. */
const TherapyKeyboard = (() => {
    const selector = '.therapy-overlay,.therapy-modal-work';
    const records = new WeakMap(), openers = new WeakMap();
    const guarded = new Set(['sessionNotesModal','assessmentModal','prescriptionModal','financialModal','treatmentModal']);
    let active = null, scheduled = false;

    function visible(node) {
        return !!node?.isConnected && !node.closest('[hidden],[inert]') && !!node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden';
    }
    function available(node) { return visible(node) && !node.matches(':disabled') && node.tabIndex >= 0; }
    function controls(root) {
        return [...root.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[tabindex],[contenteditable=true]')].filter(available);
    }
    function top() {
        return [...document.querySelectorAll(selector)].filter(visible).map((root,index)=>({root,index,z:Number.parseInt(getComputedStyle(root).zIndex)||0})).sort((a,b)=>a.z-b.z||a.index-b.index).at(-1)?.root || null;
    }
    function work(root) { return root.matches('.therapy-modal-work') || !!root.querySelector('.therapy-work-dialog'); }
    function signature(root) {
        return JSON.stringify([...root.querySelectorAll('input,select,textarea')].filter(node=>!['password','hidden','search','file'].includes(node.type)).map(node=>[node.id,node.name,node.type,['checkbox','radio'].includes(node.type)?node.checked:node.multiple?[...node.selectedOptions].map(option=>option.value):node.value]));
    }
    function closer(root) {
        const buttons = [...root.querySelectorAll('button')].filter(available);
        return buttons.find(button=>/^fechar(?:\s|$)/i.test(button.getAttribute('aria-label')||button.textContent.trim()))
            || buttons.find(button=>/^(fechar|cancelar)$/i.test(button.textContent.trim()))
            || buttons.find(button=>/^voltar(?:\s|$)/i.test(button.textContent.trim()));
    }
    function submitTarget(root) {
        if (!work(root)) return null;
        const focused = document.activeElement?.closest('form');
        const forms = [...root.querySelectorAll('form')].filter(visible);
        const form = focused && root.contains(focused) ? focused : forms.length===1 ? forms[0] : null;
        if (!form || form.querySelector('input[type=password]') || ['system-reset-form','system-password-form','activation-form'].includes(form.id)) return null;
        const button = [...form.querySelectorAll('button[type=submit],input[type=submit]')].find(available);
        return button ? {form,button} : null;
    }
    function focusFirst(root) {
        const field = [...root.querySelectorAll('form input:not([type=hidden]),form select,form textarea,[autofocus]')].find(available);
        (field || controls(root)[0] || root).focus({preventScroll:true});
    }
    function restoreFocus(record) {
        if (record?.opener && available(record.opener)) record.opener.focus({preventScroll:true});
        else {
            const heading = document.querySelector('.app-header #page-title');
            if (visible(heading)) { heading.tabIndex=-1; heading.focus({preventScroll:true}); }
        }
    }
    function decorate(root) {
        root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.tabIndex=-1;
        const heading = root.querySelector('h2,h3');
        if (heading && !root.hasAttribute('aria-label') && !root.hasAttribute('aria-labelledby')) {
            if (!heading.id) heading.id=(root.id||'therapy-modal')+'-keyboard-title';
            root.setAttribute('aria-labelledby',heading.id);
        }
        const close = closer(root), submit = submitTarget(root);
        if (close) close.setAttribute('aria-keyshortcuts','Escape');
        if (submit) submit.button.setAttribute('aria-keyshortcuts','Control+Enter Meta+Enter');
        if (heading && !heading.querySelector('.therapy-keyboard-hint')) {
            const hint=document.createElement('small');hint.className='therapy-keyboard-hint';hint.setAttribute('aria-hidden','true');
            hint.textContent=[root.matches('.therapy-modal-work')||close?'Esc fechar':'','Tab navegar',submit?'Ctrl+Enter confirmar':''].filter(Boolean).join(' · ');
            heading.appendChild(hint);
        }
    }
    function scan() {
        scheduled=false;
        const next=top();if(next===active)return;
        const previous=active, record=previous&&records.get(previous);
        if(previous&&!visible(previous)){records.delete(previous);openers.delete(previous);}
        active=next;
        if(next) {
            const returning=records.has(next);
            if(!returning)records.set(next,{opener:openers.get(next)||document.activeElement,clean:signature(next)});
            openers.delete(next);
            decorate(next);
            if(returning&&record?.opener&&next.contains(record.opener)&&available(record.opener))record.opener.focus({preventScroll:true});
            else if(!next.contains(document.activeElement))focusFirst(next);
        } else if(previous)restoreFocus(record);
    }
    function schedule() { if(!scheduled){scheduled=true;queueMicrotask(scan);} }
    function close(root) {
        if(window.therapyActionBusy)return therapyNotice('Aguarde a gravação atual.');
        const native=root.matches('.therapy-modal-work'), button=!native&&closer(root);
        if(!native&&!button)return;
        const moduleGuard=native?guarded.has(root.id):/TherapyManagementUI\.close\(/.test(button.getAttribute('onclick')||'');
        const record=records.get(root);
        if(!moduleGuard&&work(root)&&record&&record.clean!==signature(root)&&!confirm('Há alterações não salvas. Fechar sem salvar?'))return;
        if(native)window.closeModal(root.id);else button.click();
        schedule();
    }
    document.addEventListener('therapy-modal-opening',event=>{openers.set(event.target,event.detail.opener);schedule();});
    document.addEventListener('therapy-vault-locked',()=>{
        if(active){records.delete(active);openers.delete(active);}
        document.querySelectorAll(selector).forEach(root=>{records.delete(root);openers.delete(root);});
        active=null;schedule();
    });
    document.addEventListener('keydown',event=>{
        if(event.defaultPrevented||event.isComposing)return;
        const root=top();
        if(root) {
            if(root!==active)scan();
            if(event.key==='Tab') {
                const list=controls(root),first=list[0],last=list.at(-1),focused=document.activeElement;
                if(!first){event.preventDefault();root.focus();}
                else if(!root.contains(focused)||event.shiftKey&&focused===first||!event.shiftKey&&focused===last){event.preventDefault();(event.shiftKey?last:first).focus();}
                return;
            }
            if(event.key==='Escape') {
                if(event.target.matches('input[type=search]')&&event.target.value)return;
                event.preventDefault();if(!event.repeat)close(root);return;
            }
            if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)&&!event.altKey) {
                const target=submitTarget(root);if(!target)return;
                event.preventDefault();
                if(!event.repeat&&!window.therapyActionBusy)target.form.requestSubmit(target.button);
                return;
            }
        }
        const tab=event.target.closest('[role=tab]'), group=tab?.closest('[role=tablist]');
        if(!group||root&&!root.contains(group)||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        const tabs=[...group.querySelectorAll('[role=tab]')].filter(node=>visible(node)&&!node.matches(':disabled')&&node.getAttribute('aria-disabled')!=='true');
        if(!tabs.length)return;
        const index=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        const id=tabs[next].id;
        event.preventDefault();tabs[next].click();
        const target=tabs[next].isConnected?tabs[next]:id?document.getElementById(id):null;
        target?.focus({preventScroll:true});
    });
    document.addEventListener('focusin',event=>{
        const root=top();if(root&&root===active&&!root.contains(event.target))focusFirst(root);
    });
    document.addEventListener('DOMContentLoaded',()=>{
        new MutationObserver(changes=>{
            if(changes.some(change=>change.type==='attributes'||[...change.addedNodes,...change.removedNodes].some(node=>node.nodeType===1)))schedule();
        }).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
        scan();
    });
    return {refresh:schedule};
})();
