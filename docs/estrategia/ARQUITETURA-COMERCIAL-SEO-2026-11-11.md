# Arquitetura comercial e SEO por segmento

Data: 11/11/2026. Direção aprovada pelo responsável e implementada para validação local. Nenhuma publicação ou configuração de conta externa realizada nesta tarefa.

## Função de cada nível

| Página | Papel e intenção principal |
| --- | --- |
| `/` | Portal institucional; escolha da solução e acesso direto aos segmentos |
| `/tecnologia/tecnologia.html` | Catálogo de sistemas de gestão por segmento; atalhos para serviços e modelos |
| `/produtos/*.html` | Venda do sistema específico, com recursos, planos e experiência adequada ao segmento |
| `/tecnologia/sites-premium/` | Serviço de criação de sites profissionais e landing pages; modelos como referências |
| `/tecnologia/sites-para-psicologos.html` | Desenvolvimento de landing page para psicólogos e terapeutas, com oferta própria aprovada |
| `/tecnologia/ecommerce.html` | Planejamento de loja virtual e catálogo online; exemplos separados da oferta |
| `/tecnologia/automacoes.html` | Diagnóstico e desenvolvimento de automações e integrações, sob consulta |

As URLs dos produtos foram preservadas. Não criar outra página comercial para um sinônimo da mesma intenção sem conteúdo e oferta realmente distintos. A página de sistema para psicólogos e a de criação de site para psicólogos têm intenções diferentes e se referenciam.

## Mapa dos segmentos

| Segmento | Landing comercial | Título principal de busca |
| --- | --- | --- |
| Psicologia e terapia | `gestao-terapia.html` | Sistema para psicólogos e terapeutas |
| Odontologia | `gestao-odonto.html` | Sistema para clínicas odontológicas |
| Academias e estúdios | `gestao-fit.html` | Sistema para academias e estúdios |
| Gastronomia | `gestao-gastro.html` | Sistema para restaurantes e gastronomia |
| Barbearia | `barbearia-premium.html` | Sistema para barbearias |
| Beleza e spa | `beleza-spa.html` | Sistema para salão de beleza e spa |
| Assistência técnica | `assistencia-pro.html` | Sistema para assistência técnica |
| Lava-rápido | `gestao-lavarapido.html` | Sistema para lava-rápido |
| Sorveteria e açaí | `gestao-sorveteria.html` | Sistema para sorveteria e açaí |
| Comércio | `gestao-pdv.html` | Sistema PDV para comércio e varejo |
| Salas e espaços | `gestao-salas.html` | Sistema para gestão e reserva de salas |

Os nomes de produto continuam no conteúdo das páginas. Os títulos de busca explicitam a solução; não são uma pesquisa de volume ou garantia de posicionamento. Para atualizar os dados, usar consultas reais do Search Console e dados de atendimento.

## Regras para agentes e manutenção

- Ler a base `.Agent` e `produtos/PADRAO-LANDING-PAGES.md` antes de alterações.
- A padronização visual das landing pages segue em outro pacote. Preservar metadados, breadcrumbs, carregamento de `commercial-tracking.js`, `data-commercial-offer` no body e navegação relacionada ao integrar novas versões.
- Não sobrescrever páginas inteiras com uma cópia anterior que remova as alterações de SEO.
- As entradas dos 11 segmentos precisam continuar presentes em HTML na home e no catálogo, com links reais, sem depender de busca interna ou clique em uma aba.
- Manter canonical próprio, title e descrição específicos, Open Graph, Twitter Card e imagens locais existentes. As capas WebP por segmento são a referência social dos sistemas.
- Modelos de empresas fictícias e demos são referências navegáveis, não negócios reais da Plena. As 33 entradas de demonstração/modelos tratadas neste pacote receberam `noindex,follow`; os seis modelos premium individuais já continham `noindex,nofollow`.
- O sitemap contém 17 URLs comerciais. Não incluir páginas marcadas noindex ou entradas de demonstração. Atualizar `lastmod` quando o conteúdo realmente mudar.
- Os aliases antigos de landing pages e e-commerce foram direcionados às páginas comerciais pertinentes em `.htaccess`. O servidor estático local não interpreta essas regras; validar o comportamento HTTP no ambiente Apache após publicação autorizada.
- Não alterar preços ou estender o desconto do Terapia aos outros segmentos sem aprovação comercial.

## Mensuração preparada

`assets/commercial-tracking.js` cria eventos `plena_commercial_click` em `window.dataLayer`. Ele não instala um novo rastreador externo, não faz requisições e não armazena dados de pacientes ou textos de WhatsApp.

| Campo | Uso |
| --- | --- |
| `intent` | `segment`, `service`, `model`, `demo`, `trial` ou `whatsapp` |
| `offer` | Identificador do produto ou serviço |
| `page_path` | Caminho da página, sem query string |
| `destination_path` | Caminho interno ou domínio externo, sem mensagem ou parâmetros |
| `utm_source`, `utm_medium`, `utm_campaign` | Campanhas presentes na URL atual, restritas a campos e formato permitidos |

Os atributos `data-plena-kind` e `data-plena-offer` identificam os novos links. Contatos e demos existentes também são reconhecidos pelo adaptador de eventos. A classificação considera o desvio de demo para teste gratuito no Terapia mobile.

**Clique não equivale a lead recebido, teste ativado ou venda.** Esses resultados precisam de confirmação no atendimento ou CRM. Atribuição entre páginas e sessões depende da ferramenta de analytics configurada; este código não persiste campanhas em cookies ou storage.

O GTM já aparecia no código da home e do catálogo. Não foi presumido que exista uma propriedade GA4 funcional ou um contêiner publicado com os gatilhos corretos. Próximos passos dependentes das contas:

1. Conferir propriedade e fluxo GA4, consentimento e contêiner GTM vigente.
2. Configurar gatilho de evento personalizado `plena_commercial_click` e mapear os campos necessários, evitando duplicidade com eventos legados.
3. Validar no modo de prévia/DebugView antes de marcar eventos relevantes como eventos principais.
4. Verificar a propriedade Search Console, enviar o sitemap publicado e inspecionar as páginas comerciais prioritárias.
5. Estabelecer a linha de base por página/consulta e relacionar contatos qualificados, testes iniciados e vendas no atendimento.

## Divulgação e piloto recomendado

Começar pelo Gestão Terapia, que já tem proposta, demo e teste gratuito definidos. Publicações sobre agenda ou prontuário devem apontar diretamente para sua landing de sistema. Publicações sobre presença profissional devem apontar para a página de criação de site.

Exemplos de links de campanha, a usar somente após publicação:

```text
https://plenainformatica.com.br/produtos/gestao-terapia.html?utm_source=instagram&utm_medium=social&utm_campaign=terapia_rotina
https://plenainformatica.com.br/tecnologia/sites-para-psicologos.html?utm_source=instagram&utm_medium=social&utm_campaign=site_psicologos
```

Manter perfis institucionais da Plena e produzir séries por público antes de multiplicar contas. Não lançar campanhas ou assumir orçamento nesta tarefa. A escolha dos próximos segmentos deve usar demanda e conversão observadas, não apenas aparência das páginas.

## Verificação recorrente

```powershell
node tools/local/audit-commercial-seo.mjs
node --test tests/commercial-tracking.test.js
git diff --check
```

A auditoria confere páginas do sitemap, títulos únicos, H1, canonical, metadados, JSON-LD, imagens sociais e links comerciais. Ela não verifica indexação no Google, posição, dados reais de conversão ou interpretação de `.htaccess` pelo servidor de produção.

Validar também home, catálogo e serviços em desktop, 768, 375 e 320px, teclado e foco. Conferir a navegação do portal até a landing do segmento e desta para o serviço relacionado.

## Fontes da direção

- [Google: guia de SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- [Google: títulos de resultados](https://developers.google.com/search/docs/appearance/title-link).
- [Google: mudanças de URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
- [Google: políticas de spam e páginas de entrada](https://developers.google.com/search/docs/essentials/spam-policies#doorways).
