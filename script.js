document.addEventListener('DOMContentLoaded', () => {

    const PHONE = '5512981488505';
    const MSG = 'Olá! Gostaria de mais informações sobre os serviços da Plena Informática. 😊';

    // ── WhatsApp ──
    function openWA(msg) {
        window.open(`https://api.whatsapp.com/send?phone=${PHONE}&text=${encodeURIComponent(msg || MSG)}`, '_blank', 'noopener,noreferrer');
    }
    document.querySelectorAll('.whatsapp-btn').forEach(b => b.addEventListener('click', () => openWA()));

    // ── Mobile Menu ──
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
    }

    menuBtn?.addEventListener('click', () => {
        const hidden = mobileMenu.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', String(!hidden));
        iconOpen.classList.toggle('hidden', !hidden);
        iconClose.classList.toggle('hidden', hidden);
    });

    document.querySelectorAll('.mobile-link').forEach(el => el.addEventListener('click', closeMobileMenu));

    // ── Scroll Reveal ──
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ── Counter Animation ──
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix ?? '';
        const duration = 1800;
        const t0 = performance.now();
        (function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
            el.textContent = v.toLocaleString('pt-BR') + suffix;
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
    }

    const cntObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cntObs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

    // ── Testimonials Marquee ──
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
        const testimonials = [
            { q: 'O site que a Plena desenvolveu para minha empresa aumentou nossas vendas em 40%. Profissionais incríveis, entrega no prazo e suporte excelente!', n: 'Ricardo Oliveira', r: 'Empresário · desde 2023', i: 'R', g: 'from-emerald-400 to-emerald-600' },
            { q: 'A assessoria para MEI foi fundamental para regularizar minha situação. Atendimento humanizado, preço justo e total segurança no processo.', n: 'Carlos Mendes', r: 'MEI · desde 2020', i: 'C', g: 'from-purple-400 to-purple-600' },
            { q: 'Fiz meu currículo com a Plena e em duas semanas já tinha entrevistas agendadas. Eles sabem destacar o que importa!', n: 'Amanda Costa', r: 'Analista · desde 2024', i: 'A', g: 'from-pink-400 to-pink-600' },
            { q: 'Declaração de IR feita com rapidez e total transparência. É a terceira vez que faço com eles e nunca tive problema.', n: 'Patrícia Lima', r: 'Professora · desde 2019', i: 'P', g: 'from-cyan-400 to-cyan-600' },
            { q: 'Precisei de uma 2ª via de conta urgente e eles resolveram em minutos. Atendimento no WhatsApp rápido e sem burocracia.', n: 'Beatriz Rocha', r: 'Autônoma · desde 2024', i: 'B', g: 'from-rose-400 to-rose-600' },
        ];
        const star = '<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
        const stars5 = star.repeat(5);
        function makeCard(t) {
            return `<div class="marquee-card"><div class="bg-gray-50 rounded-2xl p-7 h-full border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"><div class="flex gap-0.5 mb-4">${stars5}</div><p class="text-gray-600 italic mb-6 text-sm leading-relaxed">"${t.q}"</p><div class="flex items-center gap-3 pt-4 border-t border-gray-100"><div class="w-10 h-10 rounded-full bg-gradient-to-br ${t.g} flex items-center justify-center text-white font-bold text-sm flex-shrink-0">${t.i}</div><div><p class="font-bold text-gray-900 text-sm">${t.n}</p><p class="text-gray-400 text-xs">${t.r}</p></div></div></div></div>`;
        }
        const html = testimonials.map(makeCard).join('');
        marqueeTrack.innerHTML = html + html;
    }

    // ── Modals ──
    const modals = {
        terms: document.getElementById('terms-modal'),
        privacy: document.getElementById('privacy-modal'),
    };

    function closeAll() {
        Object.values(modals).forEach(m => {
            if (!m) return;
            m.style.display = 'none';
            m.setAttribute('aria-hidden', 'true');
        });
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const m = modals[btn.dataset.modal];
            if (!m) return;
            closeAll();
            m.style.display = 'flex';
            m.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => { if (e.target === m) closeAll(); }));
    document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', closeAll));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

});

// ── Cookie Banner IIFE ──
(function () {
    if (!localStorage.getItem('plena_cookies_ok')) {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            setTimeout(() => { banner.style.display = 'block'; }, 1500);
            document.getElementById('cookie-accept')?.addEventListener('click', () => {
                localStorage.setItem('plena_cookies_ok', '1');
                banner.style.display = 'none';
            });
        }
    }
})();
