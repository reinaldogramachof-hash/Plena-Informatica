document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  if (menuBtn && mobileMenu && iconOpen && iconClose) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden', !isOpen);
      iconClose.classList.toggle('hidden', isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const phone = '5512981488505';

  window.openWhatsApp = function openWhatsApp(message) {
    const text =
      message ??
      'Olá! Gostaria de mais informações sobre os serviços digitais.';
    window.open(
      `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  document.querySelectorAll('.whatsapp-btn').forEach((button) => {
    button.addEventListener('click', () => {
      window.openWhatsApp(button.getAttribute('data-message'));
    });
  });

  const modal = document.getElementById('service-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalBtn = document.getElementById('modal-whatsapp-btn');
  const modalQuestionsBtn = document.getElementById('modal-duvidas-btn');
  const closeBtn = document.querySelector('.modal-close');

  if (modal && modalImg && modalTitle && modalBtn) {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const serviceName = item.getAttribute('data-service') ?? 'Serviço';
        const image = item.querySelector('img');
        const imageSrc = image?.getAttribute('src') ?? '';

        modalTitle.textContent = serviceName;
        modalImg.setAttribute('src', imageSrc);
        modalImg.setAttribute('alt', serviceName);

        modalBtn.onclick = () => {
          window.openWhatsApp(
            `Olá! Vim pelo site e gostaria de solicitar o serviço: *${serviceName}*.`,
          );
        };

        if (modalQuestionsBtn) {
          modalQuestionsBtn.onclick = () => {
            window.openWhatsApp(
              `Olá! Estou com algumas dúvidas sobre o serviço: *${serviceName}*. Pode me ajudar?`,
            );
          };
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll('.reveal')
    .forEach((element) => revealObserver.observe(element));

  const toolCatalog = {
    'resume-builder': {
      category: 'professional',
      benefits: [
        'Cinco modelos profissionais',
        'Visualização em tempo real',
        'Formatação automática',
      ],
      privacy: 'Seus dados permanecem neste navegador',
      time: '10 a 20 min',
      service: [
        'Currículo profissional',
        'R$ 15,00',
        'Solicitar currículo com a Plena',
      ],
    },
    'declaration-builder': {
      category: 'documents',
      benefits: [
        'Modelos orientados',
        'Estrutura profissional',
        'Prévia antes de baixar',
      ],
      privacy: 'Seus dados permanecem neste navegador',
      time: '5 a 10 min',
      service: [
        'Documento profissional',
        'R$ 15,00',
        'Solicitar documento com a Plena',
      ],
    },
    'qr-code': {
      category: 'utilities',
      benefits: ['Links, Pix, Wi-Fi e WhatsApp', 'Download imediato'],
      privacy: 'Sem cadastro e sem armazenamento',
      time: '2 a 5 min',
    },
    'images-to-pdf': {
      category: 'pdf',
      benefits: [
        'Reordene fotos e documentos',
        'Arquivos não saem do aparelho',
        'Baixe um único PDF',
      ],
      privacy: 'Processamento 100% local',
      time: '3 a 8 min',
      service: [
        'Digitalização na Plena',
        'R$ 4,00',
        'Consultar atendimento Plena',
      ],
    },
    'merge-pdf': {
      category: 'pdf',
      benefits: [
        'Junte vários documentos',
        'Escolha a ordem final',
        'Sem envio de arquivos',
      ],
      privacy: 'Processamento 100% local',
      time: '2 a 5 min',
      service: [
        'Digitalização na Plena',
        'R$ 4,00',
        'Consultar atendimento Plena',
      ],
    },
    'mei-irpf-checklist': {
      category: 'business',
      benefits: [
        'Lista personalizada',
        'Menos documentos esquecidos',
        'Sem dados sensíveis',
      ],
      privacy: 'Respostas usadas somente nesta sessão',
      time: '5 a 10 min',
      service: [
        'Declaração de IRPF',
        'R$ 110,00',
        'Solicitar atendimento para IRPF',
      ],
    },
    'menu-builder': {
      category: 'documents',
      benefits: [
        'Categorias organizadas',
        'Prévia para aprovação',
        'Pronto para impressão',
      ],
      privacy: 'Processamento 100% local',
      time: '15 a 30 min',
      service: [
        'Cardápio impresso',
        'a partir de R$ 30,00',
        'Consultar impressão de cardápio',
      ],
    },
    'business-card-creator': {
      category: 'documents',
      benefits: [
        'Três estilos profissionais',
        'Prévia em tempo real',
        'Arquivo pronto para aprovar',
      ],
      privacy: 'Processamento 100% local',
      time: '10 a 15 min',
      service: [
        '100 cartões de visitas',
        'R$ 50,00',
        'Solicitar impressão dos cartões',
      ],
    },
    'label-generator': {
      category: 'documents',
      benefits: [
        'Modelos de folha A4',
        'Contagem automática',
        'Prévia antes de imprimir',
      ],
      privacy: 'Processamento 100% local',
      time: '5 a 10 min',
      service: [
        'Impressão de etiquetas',
        'a partir de R$ 3,50',
        'Consultar impressão de etiquetas',
      ],
    },
    'mei-das-guide': {
      category: 'business',
      benefits: [
        'Organize os meses pagos',
        'Entenda os componentes do DAS',
        'Acesso ao canal oficial',
      ],
      privacy: 'Marcações ficam somente nesta sessão',
      time: '5 a 10 min',
      service: [
        'Serviços para MEI',
        'a partir de R$ 80,00',
        'Solicitar atendimento MEI',
      ],
    },
    'print-cost-estimator': {
      category: 'utilities',
      benefits: [
        'Compare custos mensais',
        'Use os dados da sua impressora',
        'Resultado orientativo',
      ],
      privacy: 'Valores não são armazenados',
      time: '3 a 5 min',
      service: [
        'Impressão na Plena',
        'a partir de R$ 3,00',
        'Consultar impressão',
      ],
    },
  };

  const toolCards = Array.from(
    document.querySelectorAll('.tool-card[data-tool]'),
  );
  const searchInput = document.getElementById('tool-search');
  const resultCount = document.getElementById('tool-result-count');
  const categoryButtons = Array.from(
    document.querySelectorAll('.hub-category[data-filter]'),
  );
  let activeCategory = 'all';

  toolCards.forEach((card) => {
    const data = toolCatalog[card.dataset.tool];
    const copy = card.querySelector('.tool-copy');
    const footer = card.querySelector('.tool-footer');

    if (!data || !copy || !footer) return;

    card.dataset.category = data.category;

    const benefits = document.createElement('ul');
    benefits.className = 'tool-benefits';
    benefits.setAttribute('aria-label', 'Benefícios');

    data.benefits.forEach((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      benefits.appendChild(item);
    });
    copy.appendChild(benefits);

    const trust = document.createElement('div');
    trust.className = 'tool-trust';
    trust.innerHTML = `<span>${data.privacy}</span><span>${data.time}</span>`;
    footer.before(trust);

    if (data.service) {
      const professional = document.createElement('a');
      professional.className = 'tool-professional';
      professional.href =
        'https://api.whatsapp.com/send?phone=5512981144676&text=' +
        encodeURIComponent(data.service[2]);
      professional.target = '_blank';
      professional.rel = 'noopener noreferrer';
      professional.setAttribute('aria-label', data.service[2]);
      professional.innerHTML = `<span>${data.service[0]}</span><strong>${data.service[1]}</strong>`;
      footer.after(professional);
    }
  });

  const emptyState = document.createElement('div');
  emptyState.className = 'tool-empty-state';
  emptyState.hidden = true;
  emptyState.innerHTML =
    '<strong>Nenhuma ferramenta encontrada.</strong><span>Tente outro termo ou limpe os filtros.</span><button type="button">Limpar filtros</button>';
  document.querySelector('.tool-grid')?.after(emptyState);

  const normalize = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const updateTools = () => {
    const query = normalize(searchInput?.value ?? '');
    let visible = 0;

    toolCards.forEach((card) => {
      const matchesCategory =
        activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesSearch =
        !query || normalize(card.textContent ?? '').includes(query);
      const show = matchesCategory && matchesSearch;

      card.hidden = !show;
      if (show) visible += 1;
    });

    if (resultCount) {
      resultCount.textContent = `${visible} ${
        visible === 1 ? 'ferramenta' : 'ferramentas'
      }`;
    }
    emptyState.hidden = visible !== 0;
  };

  searchInput?.addEventListener('input', updateTools);
  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter ?? 'all';
      categoryButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      updateTools();
    });
  });

  emptyState.querySelector('button')?.addEventListener('click', () => {
    activeCategory = 'all';
    if (searchInput) searchInput.value = '';

    categoryButtons.forEach((button) => {
      const selected = button.dataset.filter === 'all';
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    updateTools();
    searchInput?.focus();
  });

  updateTools();
});
