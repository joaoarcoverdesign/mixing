/* ═══════════════════════════════════════════════════════════════════════════
   i18n.js — internacionalização EN / PT / ES para o portfólio (site estático)

   COMO FUNCIONA
   • Cada página carrega este arquivo no <head> (síncrono), antes de tudo:
       <script src="i18n.js"></script>            (raiz)
       <script src="../i18n.js"></script>         (páginas em cases/)
   • No HTML, marque o que deve ser traduzido:
       data-i18n="chave"           → troca o texto (textContent)
       data-i18n-html="chave"      → troca conteúdo com marcação interna (innerHTML)
       data-i18n-attr="alt:chave|aria-label:outra"  → troca atributos
   • O <title> e a <meta name="description"> usam as chaves "<pagina>.meta.title"
     e "<pagina>.meta.description" — defina data-i18n-page no <html> ou <body>.
   • O switcher EN · PT · ES é injetado automaticamente dentro de .nav-inner.

   COMO EDITAR AS TRADUÇÕES
   • Tudo fica no objeto STRINGS abaixo. Cada chave tem { en, pt, es } lado a lado.
   • Mudou o texto PT? Atualize en e es na MESMA entrada. Um `git diff` neste
     arquivo mostra exatamente o que mudou e o que falta.

   LIMITAÇÃO CONHECIDA
   • A troca é no cliente: o Google indexa a página no idioma padrão (EN).
     Para um portfólio isso costuma ser aceitável (tráfego vem de link direto).
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var LANGS = ["en", "pt", "es"];
  var DEFAULT = "en";
  var STORE_KEY = "lang";

  /* ════════════════════════ DICIONÁRIO ════════════════════════
     Chaves no formato "<pagina>.<secao>.<campo>".
     "common.*" é usado em todas as páginas. */
  var STRINGS = {

    /* ─────────── COMUM (nav / rodapé) ─────────── */
    "common.nav.role": {
      en: "Product designer UX UI",
      pt: "Designer de Produto UX UI",
      es: "Diseñador de Producto UX UI"
    },
    "common.nav.works": { en: "Works", pt: "Trabalhos", es: "Trabajos" },
    "common.nav.about": { en: "About", pt: "Sobre", es: "Acerca" },
    "common.nav.contact": { en: "Contact", pt: "Contato", es: "Contacto" },
    "common.footer.rights": {
      en: "© 2026 João Abdalla. All rights reserved.",
      pt: "© 2026 João Abdalla. Todos os direitos reservados.",
      es: "© 2026 João Abdalla. Todos los derechos reservados."
    },

    /* ─────────── HOME (index.html) ─────────── */
    "home.meta.title": {
      en: "João Abdalla — Senior Product Designer · UX/UI",
      pt: "João Abdalla — Designer de Produto Sênior · UX/UI",
      es: "João Abdalla — Diseñador de Producto Senior · UX/UI"
    },
    "home.meta.description": {
      en: "Designer who builds and operates AI systems for the design process. Remote from Brazil, working with US & EU teams.",
      pt: "Designer que constrói e opera sistemas de IA para o processo de design. Remoto do Brasil, trabalhando com times dos EUA e da Europa.",
      es: "Diseñador que construye y opera sistemas de IA para el proceso de diseño. Remoto desde Brasil, trabajando con equipos de EE. UU. y Europa."
    },
    "home.hero.title": {
      en: 'Senior Product Designer <span class="sep">•</span> UX UI',
      pt: 'Designer de Produto Sênior <span class="sep">•</span> UX UI',
      es: 'Diseñador de Producto Senior <span class="sep">•</span> UX UI'
    },
    "home.hero.sub": {
      en: "Designer who builds and operates AI systems for the design process.",
      pt: "Designer que constrói e opera sistemas de IA para o processo de design.",
      es: "Diseñador que construye y opera sistemas de IA para el proceso de diseño."
    },
    "home.hero.meta": {
      en: 'Remote from <b>Brazil</b>, working with <b>US &amp; EU</b> teams',
      pt: 'Remoto do <b>Brasil</b>, trabalhando com times dos <b>EUA e da Europa</b>',
      es: 'Remoto desde <b>Brasil</b>, trabajando con equipos de <b>EE. UU. y Europa</b>'
    },
    "home.hero.cta": {
      en: "View Case Studies",
      pt: "Ver estudos de caso",
      es: "Ver casos de estudio"
    },

    "home.mock.jala.aria": {
      en: "Bring Jalasoft to front",
      pt: "Trazer Jalasoft para a frente",
      es: "Traer Jalasoft al frente"
    },
    "home.mock.jala.alt": {
      en: "Jalasoft — brand and web redesign, shown in browser",
      pt: "Jalasoft — redesenho de marca e web, exibido no navegador",
      es: "Jalasoft — rediseño de marca y web, mostrado en el navegador"
    },
    "home.mock.quero.aria": {
      en: "Bring Quero Simulados to front",
      pt: "Trazer Quero Simulados para a frente",
      es: "Traer Quero Simulados al frente"
    },
    "home.mock.quero.alt": {
      en: "Quero Simulados — exam practice platform, shown in browser",
      pt: "Quero Simulados — plataforma de simulados, exibida no navegador",
      es: "Quero Simulados — plataforma de simulacros de examen, mostrada en el navegador"
    },
    "home.mock.qcon.aria": {
      en: "Open the Qconcursos case study",
      pt: "Abrir o estudo de caso da Qconcursos",
      es: "Abrir el caso de estudio de Qconcursos"
    },
    "home.mock.qcon.alt": {
      en: "Qconcursos — platform homepage, shown in browser",
      pt: "Qconcursos — página inicial da plataforma, exibida no navegador",
      es: "Qconcursos — página de inicio de la plataforma, mostrada en el navegador"
    },

    "home.stat.users": {
      en: "Users on the platform",
      pt: "Usuários na plataforma",
      es: "Usuarios en la plataforma"
    },
    "home.stat.acq": {
      en: "Acquisition by Yduqs Group",
      pt: "Aquisição pelo Grupo Yduqs",
      es: "Adquisición por el Grupo Yduqs"
    },
    "home.stat.onb": {
      en: "Faster onboarding, MBA",
      pt: "Onboarding mais rápido, MBA",
      es: "Onboarding más rápido, MBA"
    },
    "home.stat.exp": {
      en: "Years of experience",
      pt: "Anos de experiência",
      es: "Años de experiencia"
    },

    "home.work.label": {
      en: "Selected work",
      pt: "Trabalhos selecionados",
      es: "Trabajos seleccionados"
    },
    "home.work.title": {
      en: 'Results that made a <em>difference</em>',
      pt: 'Resultados que fizeram a <em>diferença</em>',
      es: 'Resultados que marcaron la <em>diferencia</em>'
    },
    "home.work.prev": { en: "Previous case", pt: "Caso anterior", es: "Caso anterior" },
    "home.work.next": { en: "Next case", pt: "Próximo caso", es: "Caso siguiente" },

    "home.card1.alt": {
      en: "QConcursos — cascading question filter, live product screenshot",
      pt: "QConcursos — filtro de questões em cascata, captura do produto real",
      es: "QConcursos — filtro de preguntas en cascada, captura del producto real"
    },
    "home.card1.name": {
      en: "The Filter Behind the Growth",
      pt: "O filtro por trás do crescimento",
      es: "El filtro detrás del crecimiento"
    },
    "home.card1.desc": {
      en: "A 12-field cascading filter that turned a 605K-question database into a usable product — and a pricing call that quietly added R$27M a year.",
      pt: "Um filtro em cascata de 12 campos que transformou um banco de 605 mil questões em um produto usável — e uma decisão de precificação que somou R$27M por ano de forma discreta.",
      es: "Un filtro en cascada de 12 campos que convirtió una base de 605 mil preguntas en un producto usable — y una decisión de precios que sumó R$27M al año de forma discreta."
    },
    "home.card1.tag1": { en: "Edtech", pt: "Edtech", es: "Edtech" },
    "home.card1.tag2": { en: "Filtering UX", pt: "UX de filtros", es: "UX de filtrado" },
    "home.card1.tag3": { en: "Pricing", pt: "Precificação", es: "Precios" },
    "home.card1.link": {
      en: "R$27M added, part of the R$208M acquisition",
      pt: "R$27M somados, parte da aquisição de R$208M",
      es: "R$27M sumados, parte de la adquisición de R$208M"
    },

    "home.card2.alt": {
      en: "Jalasoft — design system built from a brand guideline",
      pt: "Jalasoft — design system construído a partir de um guia de marca",
      es: "Jalasoft — sistema de diseño construido a partir de una guía de marca"
    },
    "home.card2.name": {
      en: "Jalasoft Design System",
      pt: "Design System da Jalasoft",
      es: "Sistema de Diseño de Jalasoft"
    },
    "home.card2.desc": {
      en: "Building a design system from a brand guideline, then scaling it across a company of over a thousand people.",
      pt: "Construir um design system a partir de um guia de marca e escalá-lo por uma empresa de mais de mil pessoas.",
      es: "Construir un sistema de diseño a partir de una guía de marca y escalarlo en una empresa de más de mil personas."
    },
    "home.card2.tag1": { en: "Enterprise", pt: "Corporativo", es: "Corporativo" },
    "home.card2.tag2": { en: "Design System", pt: "Design System", es: "Sistema de Diseño" },
    "home.card2.tag3": { en: "Brand & Web", pt: "Marca e Web", es: "Marca y Web" },
    "home.card2.link": {
      en: "Scaled across 1,000+ people",
      pt: "Escalado por mais de 1.000 pessoas",
      es: "Escalado en más de 1.000 personas"
    },

    "home.card3.alt": {
      en: "Valt Network — product design",
      pt: "Valt Network — design de produto",
      es: "Valt Network — diseño de producto"
    },
    "home.card3.name": { en: "Valt Network", pt: "Valt Network", es: "Valt Network" },
    "home.card3.desc": {
      en: "Designing the professional layer for private-market investors and high-growth companies.",
      pt: "Desenhar a camada profissional para investidores de mercado privado e empresas de alto crescimento.",
      es: "Diseñar la capa profesional para inversores de mercado privado y empresas de alto crecimiento."
    },
    "home.card3.tag1": { en: "Fintech", pt: "Fintech", es: "Fintech" },
    "home.card3.tag2": { en: "Social Product", pt: "Produto social", es: "Producto social" },
    "home.card3.tag3": { en: "0 → 1", pt: "0 → 1", es: "0 → 1" },
    "home.card3.link": {
      en: "Live product · 12-month build",
      pt: "Produto no ar · 12 meses de construção",
      es: "Producto en vivo · 12 meses de desarrollo"
    },

    "home.card4.alt": {
      en: "My Benefits Advice — personalized plan-recommendation flow",
      pt: "My Benefits Advice — fluxo personalizado de recomendação de planos",
      es: "My Benefits Advice — flujo personalizado de recomendación de planes"
    },
    "home.card4.name": { en: "My Benefits Advice", pt: "My Benefits Advice", es: "My Benefits Advice" },
    "home.card4.desc": {
      en: "Health benefits platform with a personalized plan-recommendation engine for employees.",
      pt: "Plataforma de benefícios de saúde com um motor personalizado de recomendação de planos para funcionários.",
      es: "Plataforma de beneficios de salud con un motor personalizado de recomendación de planes para empleados."
    },
    "home.card4.tag1": { en: "Enterprise", pt: "Corporativo", es: "Corporativo" },
    "home.card4.tag2": { en: "Onboarding", pt: "Onboarding", es: "Onboarding" },
    "home.card4.tag3": { en: "Fintech", pt: "Fintech", es: "Fintech" },
    "home.card4.link": {
      en: "43% faster onboarding",
      pt: "Onboarding 43% mais rápido",
      es: "Onboarding un 43% más rápido"
    },

    "home.card5.alt": {
      en: "Qconcursos — platform redesign",
      pt: "Qconcursos — redesenho da plataforma",
      es: "Qconcursos — rediseño de la plataforma"
    },
    "home.card5.name": { en: "Qconcursos", pt: "Qconcursos", es: "Qconcursos" },
    "home.card5.desc": {
      en: "From 600K to 10M — designing for scale at Brazil's largest exam-prep edtech.",
      pt: "De 600 mil a 10 milhões — desenhar para escala na maior edtech de preparação para concursos do Brasil.",
      es: "De 600 mil a 10 millones — diseñar para escala en la mayor edtech de preparación para oposiciones de Brasil."
    },
    "home.card5.tag1": { en: "Edtech", pt: "Edtech", es: "Edtech" },
    "home.card5.tag2": { en: "8M+ Users", pt: "8M+ usuários", es: "8M+ usuarios" },
    "home.card5.tag3": { en: "Team Lead", pt: "Líder de time", es: "Líder de equipo" },
    "home.card5.link": {
      en: "600K → 10M+ users on the platform",
      pt: "600 mil → 10M+ usuários na plataforma",
      es: "600 mil → 10M+ usuarios en la plataforma"
    },

    "home.testi.label": { en: "Testimonials", pt: "Depoimentos", es: "Testimonios" },
    "home.testi.title": {
      en: 'What people <em>are saying</em>',
      pt: 'O que as pessoas <em>estão dizendo</em>',
      es: 'Lo que dice <em>la gente</em>'
    },
    "home.testi.0.quote": {
      en: "João doesn’t just design, he raises the bar for everyone. As our UX and Figma educator, he’s trained dozens of LATAM engineers who now think in product.",
      pt: "O João não só desenha, ele eleva o nível de todo mundo. Como nosso educador de UX e Figma, treinou dezenas de engenheiros da América Latina que hoje pensam como gente de produto.",
      es: "João no solo diseña, eleva el nivel de todos. Como nuestro educador de UX y Figma, ha formado a decenas de ingenieros de Latinoamérica que hoy piensan en producto."
    },
    "home.testi.0.role": {
      en: "Academic Coordinator at Jala University",
      pt: "Coordenador Acadêmico na Jala University",
      es: "Coordinador Académico en Jala University"
    },
    "home.testi.1.quote": {
      en: "João’s redesign of our course page raised the bar for the whole product. Rigorous work that scaled to millions of users without missing a beat.",
      pt: "O redesenho da nossa página de cursos feito pelo João elevou o nível do produto inteiro. Um trabalho rigoroso que escalou para milhões de usuários sem falhar.",
      es: "El rediseño de nuestra página de cursos que hizo João elevó el nivel de todo el producto. Un trabajo riguroso que escaló a millones de usuarios sin un solo tropiezo."
    },
    "home.testi.1.role": {
      en: "Product Director at Qconcursos",
      pt: "Diretor de Produto na Qconcursos",
      es: "Director de Producto en Qconcursos"
    },
    "home.testi.2.quote": {
      en: "João built our design system from a brand guideline into a component library over a thousand people now build with daily.",
      pt: "O João transformou nosso guia de marca em um design system — uma biblioteca de componentes que mais de mil pessoas usam todos os dias.",
      es: "João convirtió nuestra guía de marca en un sistema de diseño: una biblioteca de componentes con la que más de mil personas trabajan a diario."
    },
    "home.testi.2.role": {
      en: "Development Engineer at Jalasoft",
      pt: "Engenheiro de Desenvolvimento na Jalasoft",
      es: "Ingeniero de Desarrollo en Jalasoft"
    },
    "home.testi.0.aria": {
      en: "Show testimonial from Orlando Campos",
      pt: "Mostrar depoimento de Orlando Campos",
      es: "Mostrar testimonio de Orlando Campos"
    },
    "home.testi.1.aria": {
      en: "Show testimonial from Bernard de Luna",
      pt: "Mostrar depoimento de Bernard de Luna",
      es: "Mostrar testimonio de Bernard de Luna"
    },
    "home.testi.2.aria": {
      en: "Show testimonial from Mauricio Salazar",
      pt: "Mostrar depoimento de Mauricio Salazar",
      es: "Mostrar testimonio de Mauricio Salazar"
    },

    "home.closing.kicker": {
      en: "No contracts. No queues. Just great design.",
      pt: "Sem contratos. Sem filas. Só design de verdade.",
      es: "Sin contratos. Sin colas. Solo buen diseño."
    },
    "home.closing.title": {
      en: 'Ready to have a designer <em>who truly gets it?</em>',
      pt: 'Pronto para ter um designer <em>que realmente entende?</em>',
      es: '¿Listo para tener un diseñador <em>que de verdad lo entiende?</em>'
    },
    "home.closing.cta": {
      en: "Start a conversation →",
      pt: "Começar uma conversa →",
      es: "Iniciar una conversación →"
    },
    "home.closing.waHref": {
      en: "https://wa.me/5561993734553?text=Hi%20Jo%C3%A3o%2C%20I%20want%20to%20talk%20about%20my%20product.",
      pt: "https://wa.me/5561993734553?text=Oi%20Jo%C3%A3o%2C%20quero%20falar%20sobre%20o%20meu%20produto.",
      es: "https://wa.me/5561993734553?text=Hola%20Jo%C3%A3o%2C%20quiero%20hablar%20sobre%20mi%20producto."
    },

    /* ─────────── SOBRE (about.html) ─────────── */
    "about.meta.title": {
      en: "About — João Abdalla — Senior Product Designer · UX/UI",
      pt: "Sobre — João Abdalla — Designer de Produto Sênior · UX/UI",
      es: "Acerca — João Abdalla — Diseñador de Producto Senior · UX/UI"
    },
    "about.meta.description": {
      en: "Senior Product Designer with 20+ years shipping digital products across edtech, fintech, and enterprise SaaS. Based in Brazil, working remotely with US and EU teams.",
      pt: "Designer de Produto Sênior com mais de 20 anos entregando produtos digitais em edtech, fintech e SaaS corporativo. Baseado no Brasil, trabalhando remotamente com times dos EUA e da Europa.",
      es: "Diseñador de Producto Senior con más de 20 años entregando productos digitales en edtech, fintech y SaaS corporativo. Radicado en Brasil, trabajando en remoto con equipos de EE. UU. y Europa."
    },
    "about.hero.label": { en: "About", pt: "Sobre", es: "Acerca" },
    "about.hero.title": {
      en: 'Senior Product Designer with <i>20+ years</i> shipping digital products across edtech, fintech, and enterprise SaaS.',
      pt: 'Designer de Produto Sênior com <i>mais de 20 anos</i> entregando produtos digitais em edtech, fintech e SaaS corporativo.',
      es: 'Diseñador de Producto Senior con <i>más de 20 años</i> entregando productos digitales en edtech, fintech y SaaS corporativo.'
    },
    "about.hero.lede": {
      en: "I'm João Abdalla — based in Brazil, working remotely with international teams.",
      pt: "Sou o João Abdalla — baseado no Brasil, trabalhando remotamente com times internacionais.",
      es: "Soy João Abdalla — radicado en Brasil, trabajando en remoto con equipos internacionales."
    },
    "about.hero.status": {
      en: "Available for remote collaboration",
      pt: "Disponível para colaboração remota",
      es: "Disponible para colaboración remota"
    },
    "about.hero.loc": {
      en: 'Based in <b>Brasília, Brazil</b> · <b>US &amp; EU</b> teams',
      pt: 'Baseado em <b>Brasília, Brasil</b> · times dos <b>EUA e da Europa</b>',
      es: 'Radicado en <b>Brasilia, Brasil</b> · equipos de <b>EE. UU. y Europa</b>'
    },
    "about.badge.a.num": {
      en: 'Since <i>2005</i>', pt: 'Desde <i>2005</i>', es: 'Desde <i>2005</i>'
    },
    "about.badge.a.lab": {
      en: "Marketing & digital design",
      pt: "Marketing e design digital",
      es: "Marketing y diseño digital"
    },
    "about.badge.b.num": {
      en: '<i>8M+</i> users', pt: '<i>8M+</i> usuários', es: '<i>8M+</i> usuarios'
    },
    "about.badge.b.lab": {
      en: "Platform led at scale",
      pt: "Plataforma liderada em escala",
      es: "Plataforma liderada a escala"
    },
    "about.portrait.caption": {
      en: '🎓 Teaching UX/UI &amp; Figma at <b>Jala University</b>',
      pt: '🎓 Ensino UX/UI e Figma na <b>Jala University</b>',
      es: '🎓 Enseño UX/UI y Figma en <b>Jala University</b>'
    },
    "about.stat.1": {
      en: "Years across UX/UI, product strategy & front-end",
      pt: "Anos entre UX/UI, estratégia de produto e front-end",
      es: "Años entre UX/UI, estrategia de producto y front-end"
    },
    "about.stat.2": {
      en: "Active users on Brazil's largest exam-prep platform",
      pt: "Usuários ativos na maior plataforma de preparação para concursos do Brasil",
      es: "Usuarios activos en la mayor plataforma de preparación para oposiciones de Brasil"
    },
    "about.stat.3": {
      en: "Multi-role enterprise systems built from zero",
      pt: "Sistemas corporativos multiperfil construídos do zero",
      es: "Sistemas corporativos multiperfil construidos desde cero"
    },
    "about.stat.4": {
      en: "Designers & engineers trained at Jala University",
      pt: "Designers e engenheiros treinados na Jala University",
      es: "Diseñadores e ingenieros formados en Jala University"
    },
    "about.story.label": {
      en: "The long version", pt: "A versão longa", es: "La versión larga"
    },
    "about.story.title": {
      en: 'How I got <em>here</em>',
      pt: 'Como cheguei <em>até aqui</em>',
      es: 'Cómo llegué <em>hasta aquí</em>'
    },
    "about.ch1.name": { en: "Foundation", pt: "Base", es: "Base" },
    "about.ch1.text": {
      en: "I graduated in <b>2005</b> with a specialization in marketing and digital design, and over the past 20+ years I've worked across <b>UX/UI, product strategy, and front-end development</b> — designing products where the stakes are real: compliance, payroll, healthcare decisions, financial data.",
      pt: "Me formei em <b>2005</b> com especialização em marketing e design digital e, nos últimos 20+ anos, trabalhei entre <b>UX/UI, estratégia de produto e desenvolvimento front-end</b> — desenhando produtos em que o risco é real: compliance, folha de pagamento, decisões de saúde, dados financeiros.",
      es: "Me gradué en <b>2005</b> con una especialización en marketing y diseño digital y, durante los últimos 20+ años, he trabajado entre <b>UX/UI, estrategia de producto y desarrollo front-end</b> — diseñando productos donde lo que está en juego es real: compliance, nóminas, decisiones de salud, datos financieros."
    },
    "about.ch2.name": { en: "Scale", pt: "Escala", es: "Escala" },
    "about.ch2.text": {
      en: "I've led design for Brazil's largest exam-prep platform, with <b>8M+ active users</b>, built multi-role enterprise systems from zero, and shipped products for US-based SaaS teams as a remote contractor. I also teach UX/UI and Figma at <b>Jala University</b>, training the next generation of LATAM designers and engineers.",
      pt: "Liderei o design da maior plataforma de preparação para concursos do Brasil, com <b>mais de 8M de usuários ativos</b>, construí sistemas corporativos multiperfil do zero e entreguei produtos para times de SaaS nos EUA como contratado remoto. Também ensino UX/UI e Figma na <b>Jala University</b>, formando a próxima geração de designers e engenheiros da América Latina.",
      es: "Lideré el diseño de la mayor plataforma de preparación para oposiciones de Brasil, con <b>más de 8M de usuarios activos</b>, construí sistemas corporativos multiperfil desde cero y entregué productos para equipos de SaaS en EE. UU. como contratista remoto. También enseño UX/UI y Figma en <b>Jala University</b>, formando a la próxima generación de diseñadores e ingenieros de Latinoamérica."
    },
    "about.quote": {
      en: "I care about <em>the system underneath the screen</em> as much as the screen itself — because the best interface in the world doesn't help if the structure behind it is broken.",
      pt: "Eu me importo com <em>o sistema por baixo da tela</em> tanto quanto com a tela em si — porque a melhor interface do mundo não adianta se a estrutura por trás dela está quebrada.",
      es: "Me importa <em>el sistema que hay debajo de la pantalla</em> tanto como la pantalla en sí — porque la mejor interfaz del mundo no sirve si la estructura que hay detrás está rota."
    },
    "about.contact.label": { en: "Contact", pt: "Contato", es: "Contacto" },
    "about.contact.title": {
      en: "Let's build something <em>that matters</em>",
      pt: 'Vamos construir algo <em>que importa</em>',
      es: 'Construyamos algo <em>que importe</em>'
    },
    "about.contact.p1": {
      en: "Got a product or feature to design? Need a Senior Product Designer to plug into your team?",
      pt: "Tem um produto ou funcionalidade para desenhar? Precisa de um Designer de Produto Sênior para entrar no seu time?",
      es: "¿Tienes un producto o una funcionalidad para diseñar? ¿Necesitas un Diseñador de Producto Senior que se sume a tu equipo?"
    },
    "about.contact.p2": {
      en: "I'm available for remote collaboration as an independent contractor (UX/UI, Product Design).",
      pt: "Estou disponível para colaboração remota como contratado independente (UX/UI, Design de Produto).",
      es: "Estoy disponible para colaboración remota como contratista independiente (UX/UI, Diseño de Producto)."
    },
    "about.contact.fact1": {
      en: '<b>Based in</b> Brasília, Brazil',
      pt: '<b>Baseado em</b> Brasília, Brasil',
      es: '<b>Radicado en</b> Brasilia, Brasil'
    },
    "about.contact.fact2": {
      en: 'Working with <b>US &amp; EU</b> time zones, async and in real time — invoicing in <b>USD</b>.',
      pt: 'Trabalhando nos fusos dos <b>EUA e da Europa</b>, de forma assíncrona e em tempo real — faturando em <b>USD</b>.',
      es: 'Trabajando en las zonas horarias de <b>EE. UU. y Europa</b>, en asíncrono y en tiempo real — facturando en <b>USD</b>.'
    },
    "about.contact.cta": {
      en: "Connect with me on LinkedIn →",
      pt: "Conecte-se comigo no LinkedIn →",
      es: "Conéctate conmigo en LinkedIn →"
    }
  };

  /* ═════════════════════════ RUNTIME ═════════════════════════ */

  function safeLocalGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeLocalSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function detect() {
    var q = null;
    try { q = new URL(window.location.href).searchParams.get("lang"); } catch (e) {}
    if (q && LANGS.indexOf(q) > -1) { safeLocalSet(STORE_KEY, q); return q; }
    var s = safeLocalGet(STORE_KEY);
    if (s && LANGS.indexOf(s) > -1) return s;
    var n = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) > -1 ? n : DEFAULT;
  }

  var current = detect();
  var root = document.documentElement;
  var htmlLang = function (l) { return l === "pt" ? "pt-BR" : l; };
  root.lang = htmlLang(current);

  /* HEAD TIME: esconde o conteúdo traduzível até a troca (só quando não é o
     idioma padrão) — evita o "flash" do inglês para quem lê em PT/ES. */
  if (current !== DEFAULT) {
    var cloak = document.createElement("style");
    cloak.id = "i18n-cloak";
    cloak.textContent = "[data-i18n],[data-i18n-html]{visibility:hidden!important}";
    (document.head || root).appendChild(cloak);
  }

  /* CSS do switcher — injetado uma vez, usa os tokens do site com fallback. */
  var sw = document.createElement("style");
  sw.textContent =
    ".lang-switch{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto}" +
    ".lang-switch-btn{font-family:var(--sans,'Urbanist',sans-serif);font-size:12px;" +
    "font-weight:700;letter-spacing:.12em;text-transform:uppercase;line-height:1;" +
    "padding:4px 2px;color:var(--dim,#5E676D);transition:color .2s ease}" +
    ".lang-switch-btn:hover{color:var(--white,#F4F6F3)}" +
    ".lang-switch-btn.is-active{color:var(--white,#F4F6F3);text-decoration:underline;" +
    "text-underline-offset:5px;text-decoration-thickness:1px}" +
    ".lang-switch>span{color:var(--line,#5E676D);font-size:10px}" +
    "@media (max-width:560px){.lang-switch{gap:6px}.lang-switch-btn{font-size:11px}}";
  (document.head || root).appendChild(sw);

  function removeCloak() {
    var c = document.getElementById("i18n-cloak");
    if (c && c.parentNode) c.parentNode.removeChild(c);
  }

  function val(key) {
    var e = STRINGS[key];
    if (!e) return null;
    return e[current] != null ? e[current] : e[DEFAULT];
  }

  var changeCbs = [];

  function applySwaps() {
    root.lang = htmlLang(current);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = val(el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = val(el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split("|").forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i < 0) return;
        var attr = pair.slice(0, i).trim();
        var v = val(pair.slice(i + 1).trim());
        if (v != null) el.setAttribute(attr, v);
      });
    });

    var page = (document.body && document.body.getAttribute("data-i18n-page")) ||
               root.getAttribute("data-i18n-page");
    if (page) {
      var t = val(page + ".meta.title");
      if (t) document.title = t;
      var m = document.querySelector('meta[name="description"]');
      var mv = val(page + ".meta.description");
      if (m && mv) m.setAttribute("content", mv);
    }

    updateSwitcher();
    changeCbs.forEach(function (cb) { try { cb(current); } catch (e) {} });
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === current) return;
    current = l;
    safeLocalSet(STORE_KEY, l);
    try {
      var u = new URL(window.location.href);
      u.searchParams.set("lang", l);
      window.history.replaceState(null, "", u);
    } catch (e) {}
    applySwaps();
  }

  function buildSwitcher() {
    var host = document.querySelector(".nav-inner");
    if (!host || host.querySelector(".lang-switch")) return;
    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language / Idioma");
    LANGS.forEach(function (l, idx) {
      if (idx) {
        var sep = document.createElement("span");
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = "·";
        wrap.appendChild(sep);
      }
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-switch-btn";
      b.setAttribute("data-lang", l);
      b.textContent = l.toUpperCase();
      b.addEventListener("click", function () { setLang(l); });
      wrap.appendChild(b);
    });
    host.appendChild(wrap);
  }

  function updateSwitcher() {
    var btns = document.querySelectorAll(".lang-switch-btn");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-lang") === current;
      btns[i].classList.toggle("is-active", on);
      btns[i].setAttribute("aria-current", on ? "true" : "false");
    }
  }

  /* API pública — páginas podem ler o idioma atual e reagir à troca. */
  window.I18N = {
    get lang() { return current; },
    t: val,
    set: setLang,
    langs: LANGS.slice(),
    onChange: function (cb) { if (typeof cb === "function") changeCbs.push(cb); return cb; }
  };

  function init() {
    buildSwitcher();
    if (current !== DEFAULT) applySwaps();
    else { updateSwitcher(); changeCbs.forEach(function (cb) { try { cb(current); } catch (e) {} }); }
    removeCloak();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* rede de segurança: se algo travar antes do init, nunca deixe a página invisível. */
  window.addEventListener("load", removeCloak);
  setTimeout(removeCloak, 3000);
})();
