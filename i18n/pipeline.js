/* ═══════════════════════════════════════════════════════════════════════════
   i18n/pipeline.js — traduções da página pipeline.html (EN · PT · ES)

   Carregado ANTES de ./i18n.js:
     <script src="i18n/pipeline.js"></script>
     <script src="i18n.js"></script>
   ═══════════════════════════════════════════════════════════════════════════ */

window.I18N_PAGE_STRINGS = {

  /* ─────────── META ─────────── */
  "pipeline.meta.title": {
    en: "The Pipeline — designing with a team of AI agents | Abdalla Design",
    pt: "O Pipeline — projetar com um time de agentes de IA | Abdalla Design",
    es: "El Pipeline — diseñar con un equipo de agentes de IA | Abdalla Design"
  },
  "pipeline.meta.description": {
    en: "A designer directing a team of specialised AI agents across UX, UI and development. The value is in the creative direction and the curation — not the tool.",
    pt: "Um designer orquestrando um time de agentes de IA especializados em UX, UI e desenvolvimento. O valor está na direção criativa e na curadoria — não na ferramenta.",
    es: "Un diseñador orquestando un equipo de agentes de IA especializados en UX, UI y desarrollo. El valor está en la dirección creativa y en la curaduría — no en la herramienta."
  },

  /* ─────────── 1 · ABERTURA CONCEITUAL ─────────── */
  "pipeline.hero.label": {
    en: "The pipeline", pt: "O pipeline", es: "El pipeline"
  },
  "pipeline.hero.title": {
    en: "Design isn't made by one person with a tool anymore.",
    pt: "Design não é mais feito por um humano com uma ferramenta.",
    es: "El diseño ya no lo hace una persona con una herramienta."
  },
  "pipeline.hero.body": {
    en: "It's one person directing a team of specialised AI agents. Each agent has one specific superpower — typography, colour, UX, art direction, motion. The orchestrator's value is in the <b>creative direction</b>, in <b>curating the output</b>, and in the <b>narrative stitching</b> between the pieces.",
    pt: "É um humano orquestrando um time de agentes de IA especializados. Cada agente tem um superpoder específico — tipografia, cor, UX, direção de arte, motion. O valor do orquestrador está na <b>direção criativa</b>, na <b>curadoria do output</b> e na <b>costura narrativa</b> entre as peças.",
    es: "Es un humano orquestando un equipo de agentes de IA especializados. Cada agente tiene un superpoder específico — tipografía, color, UX, dirección de arte, motion. El valor del orquestador está en la <b>dirección creativa</b>, en la <b>curaduría del resultado</b> y en la <b>costura narrativa</b> entre las piezas."
  },

  /* ─────────── 2 · O SISTEMA ─────────── */
  "pipeline.sys.label": {
    en: "The system", pt: "O sistema", es: "El sistema"
  },
  "pipeline.sys.title": {
    en: 'How the system <em>works</em>',
    pt: 'Como o sistema <em>funciona</em>',
    es: 'Cómo funciona <em>el sistema</em>'
  },
  "pipeline.sys.intro": {
    en: "A pipeline of three sequential blocks — UX, UI and development. Each block runs a fixed sequence of specialised agents, and each step hands the next one its exact input. Open a block to see every agent inside it.",
    pt: "Um pipeline de três blocos sequenciais — UX, UI e desenvolvimento. Cada bloco roda uma sequência fixa de agentes especializados, e cada etapa entrega à próxima a sua entrada exata. Abra um bloco para ver cada agente dentro dele.",
    es: "Un pipeline de tres bloques secuenciales — UX, UI y desarrollo. Cada bloque ejecuta una secuencia fija de agentes especializados, y cada etapa entrega a la siguiente su insumo exacto. Abre un bloque para ver cada agente dentro."
  },
  "pipeline.sys.tag": {
    en: "Orchestrator", pt: "Orquestrador", es: "Orquestador"
  },

  /* tags de etapa (reutilizados nos 3 blocos) */
  "pipeline.sys.tag.optional": { en: "Optional", pt: "Opcional", es: "Opcional" },
  "pipeline.sys.tag.check": { en: "Checkpoint", pt: "Checagem", es: "Control" },
  "pipeline.sys.tag.yourcall": { en: "Your call", pt: "Sua escolha", es: "Tu decisión" },
  "pipeline.sys.tag.manual": { en: "Manual", pt: "Manual", es: "Manual" },

  /* ── BLOCO 1 · UX ── */
  "pipeline.sys.b1.name": { en: "UX", pt: "UX", es: "UX" },
  "pipeline.sys.b1.desc": {
    en: "Framing the problem, the audience and the shape of the solution — before a single screen exists.",
    pt: "Enquadrar o problema, o público e o formato da solução — antes de existir uma única tela.",
    es: "Enmarcar el problema, el público y la forma de la solución — antes de que exista una sola pantalla."
  },
  "pipeline.sys.b1.meta": {
    en: "MVP · 6 fixed steps + 2 optional",
    pt: "MVP · 6 etapas fixas + 2 opcionais",
    es: "MVP · 6 etapas fijas + 2 opcionales"
  },
  "pipeline.sys.b1.s1.name": { en: "Briefing", pt: "Briefing", es: "Briefing" },
  "pipeline.sys.b1.s1.desc": {
    en: "Reads the loose pre-brief and structures context, goal and constraints.",
    pt: "Lê o pré-briefing solto e estrutura contexto, objetivo e restrições.",
    es: "Lee el pre-briefing suelto y estructura contexto, objetivo y restricciones."
  },
  "pipeline.sys.b1.s2.name": { en: "UX proposal", pt: "Proposta UX", es: "Propuesta UX" },
  "pipeline.sys.b1.s2.desc": {
    en: "Defines the Why and the project's priority risks.",
    pt: "Define o Why e os riscos prioritários do projeto.",
    es: "Define el Why y los riesgos prioritarios del proyecto."
  },
  "pipeline.sys.b1.s3.name": { en: "Market benchmark", pt: "Benchmark de mercado", es: "Benchmark de mercado" },
  "pipeline.sys.b1.s3.desc": {
    en: "4–8 competitor references. Only runs on request.",
    pt: "4 a 8 referências de concorrência. Só roda se pedido.",
    es: "4 a 8 referencias de competencia. Solo se ejecuta si se pide."
  },
  "pipeline.sys.b1.s4.name": { en: "Persona + Journey + JTBD", pt: "Persona + Jornada + JTBD", es: "Persona + Journey + JTBD" },
  "pipeline.sys.b1.s4.desc": {
    en: "A single document merging the three original agents.",
    pt: "Documento único, fusão dos três agentes originais.",
    es: "Un único documento que fusiona los tres agentes originales."
  },
  "pipeline.sys.b1.s5.name": { en: "Sitemap + Task flow", pt: "Sitemap + Task flow", es: "Sitemap + Task flow" },
  "pipeline.sys.b1.s5.desc": {
    en: "Screen structure and the flow of the priority task.",
    pt: "Estrutura de telas e o fluxo da tarefa prioritária.",
    es: "Estructura de pantallas y el flujo de la tarea prioritaria."
  },
  "pipeline.sys.b1.s6.name": { en: "Wireframe", pt: "Wireframe", es: "Wireframe" },
  "pipeline.sys.b1.s6.desc": {
    en: "Low fidelity, one per flow from the task flow.",
    pt: "Baixa fidelidade, um por fluxo do task flow.",
    es: "Baja fidelidad, uno por flujo del task flow."
  },
  "pipeline.sys.b1.s7.name": { en: "UX critic", pt: "Crítico UX", es: "Crítico UX" },
  "pipeline.sys.b1.s7.desc": {
    en: "One pass only. A descriptive review, not a veto — the call to adjust is yours.",
    pt: "1 passada só. Parecer descritivo, não reprova — a decisão de ajustar é sua.",
    es: "Una sola pasada. Un parecer descriptivo, no un veto — la decisión de ajustar es tuya."
  },
  "pipeline.sys.b1.s8.name": { en: "Final UX document", pt: "Documento final UX", es: "Documento final UX" },
  "pipeline.sys.b1.s8.desc": {
    en: "Consolidated handoff — markdown plus an HTML version with brand identity.",
    pt: "Handoff consolidado — markdown + versão HTML com identidade de marca.",
    es: "Handoff consolidado — markdown más una versión HTML con identidad de marca."
  },

  /* ── BLOCO 2 · UI ── */
  "pipeline.sys.b2.name": { en: "UI", pt: "UI", es: "UI" },
  "pipeline.sys.b2.desc": {
    en: "Turning the structure into a visual language — type, colour, art direction, and the details that carry the brand.",
    pt: "Transformar a estrutura em uma linguagem visual — tipografia, cor, direção de arte e os detalhes que carregam a marca.",
    es: "Convertir la estructura en un lenguaje visual — tipografía, color, dirección de arte y los detalles que cargan la marca."
  },
  "pipeline.sys.b2.meta": {
    en: "8 steps · 1 manual choice",
    pt: "8 etapas · 1 escolha manual",
    es: "8 etapas · 1 elección manual"
  },
  "pipeline.sys.b2.s1.name": { en: "Visual benchmark", pt: "Benchmark visual", es: "Benchmark visual" },
  "pipeline.sys.b2.s1.desc": {
    en: "Visual references for style and composition.",
    pt: "Referências visuais de estilo e composição.",
    es: "Referencias visuales de estilo y composición."
  },
  "pipeline.sys.b2.s2.name": { en: "Inputs summary", pt: "Resumo de insumos", es: "Resumen de insumos" },
  "pipeline.sys.b2.s2.desc": {
    en: "Consolidates everything Block 1 already defined.",
    pt: "Consolida tudo que o Bloco 1 já definiu.",
    es: "Consolida todo lo que el Bloque 1 ya definió."
  },
  "pipeline.sys.b2.s3.name": { en: "Visual directions", pt: "Propostas visuais", es: "Propuestas visuales" },
  "pipeline.sys.b2.s3.desc": {
    en: "Generates 3 directions. You pick one by hand, or bring a new reference.",
    pt: "Gera 3 direções. Você escolhe uma manualmente, ou traz referência nova.",
    es: "Genera 3 direcciones. Eliges una a mano, o traes una referencia nueva."
  },
  "pipeline.sys.b2.s4.name": { en: "Palette + Type", pt: "Paleta + Tipografia", es: "Paleta + Tipografía" },
  "pipeline.sys.b2.s4.desc": {
    en: "Applies the chosen direction as a colour and type system.",
    pt: "Aplica a direção escolhida em sistema de cor e tipo.",
    es: "Aplica la dirección elegida como sistema de color y tipografía."
  },
  "pipeline.sys.b2.s5.name": { en: "8px grid", pt: "Grade de 8px", es: "Grilla de 8px" },
  "pipeline.sys.b2.s5.desc": {
    en: "Refines spacing and alignment on the grid.",
    pt: "Refina espaçamento e alinhamento no grid.",
    es: "Refina espaciado y alineación en la grilla."
  },
  "pipeline.sys.b2.s6.name": { en: "UI critic", pt: "Crítico UI", es: "Crítico UI" },
  "pipeline.sys.b2.s6.desc": {
    en: "Visual consistency check before handoff.",
    pt: "Checagem de consistência visual antes do handoff.",
    es: "Verificación de consistencia visual antes del handoff."
  },
  "pipeline.sys.b2.s7.name": { en: "Final UI document", pt: "Documento final UI", es: "Documento final UI" },
  "pipeline.sys.b2.s7.desc": {
    en: "HTML/CSS of the real screens plus a style-guide page.",
    pt: "HTML/CSS das telas reais + página de style guide.",
    es: "HTML/CSS de las pantallas reales más una página de style guide."
  },
  "pipeline.sys.b2.s8.name": { en: "design.md", pt: "design.md", es: "design.md" },
  "pipeline.sys.b2.s8.desc": {
    en: "Literal tokens — the technical bridge to Block 3.",
    pt: "Tokens literais — a ponte técnica para o Bloco 3.",
    es: "Tokens literales — el puente técnico hacia el Bloque 3."
  },

  /* ── BLOCO 3 · DESENVOLVIMENTO ── */
  "pipeline.sys.b3.name": { en: "Development", pt: "Desenvolvimento", es: "Desarrollo" },
  "pipeline.sys.b3.desc": {
    en: "Making it move and making it real — motion, 3D, and a final production pass before handoff.",
    pt: "Colocar em movimento e tornar real — motion, 3D e um passe final de produção antes da entrega.",
    es: "Ponerlo en movimiento y hacerlo real — motion, 3D y un pase final de producción antes de la entrega."
  },
  "pipeline.sys.b3.meta": {
    en: "7 steps · 2 manual in Claude Design",
    pt: "7 etapas · 2 manuais no Claude Design",
    es: "7 etapas · 2 manuales en Claude Design"
  },
  "pipeline.sys.b3.s1.name": { en: "Initial layout", pt: "Layout inicial", es: "Layout inicial" },
  "pipeline.sys.b3.s1.desc": {
    en: "Manual, in Claude Design. Uses the two final documents plus design.md.",
    pt: "Manual, no Claude Design. Usa os 2 documentos finais + design.md.",
    es: "Manual, en Claude Design. Usa los 2 documentos finales + design.md."
  },
  "pipeline.sys.b3.s2.name": { en: "Block 3 critic · 1st", pt: "Crítico Bloco 3 · 1ª", es: "Crítico Bloque 3 · 1ª" },
  "pipeline.sys.b3.s2.desc": {
    en: "Checks fidelity to the approved UX/UI. Doesn't reopen validated structure.",
    pt: "Checa fidelidade ao UX/UI aprovado. Não reabre estrutura já validada.",
    es: "Verifica la fidelidad al UX/UI aprobado. No reabre estructura ya validada."
  },
  "pipeline.sys.b3.s3.name": { en: "Fine visual refinement", pt: "Refinamento visual fino", es: "Refinamiento visual fino" },
  "pipeline.sys.b3.s3.desc": {
    en: "Manual, in Claude Design. Detail polish.",
    pt: "Manual, no Claude Design. Polimento de detalhe.",
    es: "Manual, en Claude Design. Pulido de detalle."
  },
  "pipeline.sys.b3.s4.name": { en: "Technical analyst", pt: "Analista técnico", es: "Analista técnico" },
  "pipeline.sys.b3.s4.desc": {
    en: "Asks about scope, integrations and hosting before generating requirements.",
    pt: "Pergunta escopo, integrações e hospedagem antes de gerar requisitos.",
    es: "Pregunta por alcance, integraciones y hosting antes de generar requisitos."
  },
  "pipeline.sys.b3.s5.name": { en: "Executor agents", pt: "Agentes executores", es: "Agentes ejecutores" },
  "pipeline.sys.b3.s5.desc": {
    en: "One per technical requirement, created on demand.",
    pt: "Um por requisito técnico, criados sob demanda.",
    es: "Uno por requisito técnico, creados bajo demanda."
  },
  "pipeline.sys.b3.s6.name": { en: "Block 3 critic · 2nd", pt: "Crítico Bloco 3 · 2ª", es: "Crítico Bloque 3 · 2ª" },
  "pipeline.sys.b3.s6.desc": {
    en: "Over the consolidated code, before closing.",
    pt: "Sobre o código consolidado, antes de fechar.",
    es: "Sobre el código consolidado, antes de cerrar."
  },
  "pipeline.sys.b3.s7.name": { en: "Integrator", pt: "Integrador", es: "Integrador" },
  "pipeline.sys.b3.s7.desc": {
    en: "Closes Block 3 and consolidates the final delivery.",
    pt: "Fecha o Bloco 3 e consolida a entrega final.",
    es: "Cierra el Bloque 3 y consolida la entrega final."
  },

  /* ─────────── 3 · SEU PAPEL ─────────── */
  "pipeline.role.label": {
    en: "My role", pt: "Meu papel", es: "Mi rol"
  },
  "pipeline.role.title": {
    en: 'What I actually <em>do</em>',
    pt: 'O que eu faço, <em>de fato</em>',
    es: 'Lo que <em>hago</em>, en realidad'
  },
  "pipeline.role.lead": {
    en: "I don't generate — I direct.",
    pt: "Eu não gero — eu dirijo.",
    es: "No genero — dirijo."
  },
  "pipeline.role.body": {
    en: "I set the right sequence of agents, decide the inputs each one gets from the last, and — above all — review and approve every step with a designer's eye before it moves forward. When an output isn't good enough, I step in, adjust it and redo that specific link — without restarting the process from scratch.",
    pt: "Defino a sequência certa de agentes, decido os insumos que cada um recebe do anterior e, principalmente, reviso e aprovo cada etapa com meu olho de designer antes dela avançar. Quando uma saída não está boa, eu intervenho, ajusto e refaço aquele elo específico — sem recomeçar o processo do zero.",
    es: "Defino la secuencia correcta de agentes, decido los insumos que cada uno recibe del anterior y, sobre todo, reviso y apruebo cada etapa con mi ojo de diseñador antes de que avance. Cuando una salida no está bien, intervengo, la ajusto y rehago ese eslabón específico — sin empezar el proceso de cero."
  },
  "pipeline.role.why": {
    en: "So why not do this alone, straight into an AI generator? Because the good result isn't in the tool. <b>It's in the curation.</b>",
    pt: "Então por que não fazer isso sozinho, direto num gerador de IA? Porque o resultado bom não está na ferramenta. <b>Está na curadoria.</b>",
    es: "¿Entonces por qué no hacer esto solo, directo en un generador de IA? Porque el buen resultado no está en la herramienta. <b>Está en la curaduría.</b>"
  },
  "pipeline.role.step1": { en: "Direct", pt: "Dirigir", es: "Dirigir" },
  "pipeline.role.step2": { en: "Review", pt: "Revisar", es: "Revisar" },
  "pipeline.role.step3": { en: "Approve", pt: "Aprovar", es: "Aprobar" },
  "pipeline.role.loopback": {
    en: "Not good enough → adjust and redo that link",
    pt: "Não está bom → ajusto e refaço aquele elo",
    es: "No está bien → ajusto y rehago ese eslabón"
  },

  /* ─────────── 4 · PROVA EM AÇÃO — RICKY'S FARMS ─────────── */
  "pipeline.proof.label": {
    en: "In action", pt: "Em ação", es: "En acción"
  },
  "pipeline.proof.title": {
    en: 'The system <em>in action</em>',
    pt: 'O sistema <em>em funcionamento</em>',
    es: 'El sistema <em>en funcionamiento</em>'
  },
  "pipeline.proof.kicker": {
    en: "Case · Ricky's Farms",
    pt: "Case · Ricky's Farms",
    es: "Caso · Ricky's Farms"
  },
  "pipeline.proof.intro": {
    en: "Ricky's Farms — a local produce farm taking its shop online — used as evidence, not as the headline. Two concrete moments where a human decision changed the direction inside the flow.",
    pt: "Ricky's Farms — uma fazenda de produtos locais levando a loja para o online — usada como evidência, não como protagonista. Dois momentos concretos em que uma decisão humana mudou a direção dentro do fluxo.",
    es: "Ricky's Farms — una granja de productos locales que lleva su tienda al online — usada como evidencia, no como protagonista. Dos momentos concretos en los que una decisión humana cambió la dirección dentro del flujo."
  },
  "pipeline.proof.col1": { en: "The stage", pt: "A etapa", es: "La etapa" },
  "pipeline.proof.col2": { en: "What the agent returned", pt: "O que o agente devolveu", es: "Lo que el agente devolvió" },
  "pipeline.proof.col3": { en: "My call", pt: "Minha decisão", es: "Mi decisión" },

  "pipeline.proof.s1.stage": {
    en: "UI · Colour & art direction",
    pt: "UI · Cor e direção de arte",
    es: "UI · Color y dirección de arte"
  },
  "pipeline.proof.s1.output": {
    en: "A first palette built from the brief alone: clean greens, a lot of white, a safe gradient. The design critic flagged it — it read like a corporate SaaS dashboard, not a family farm.",
    pt: "Uma primeira paleta construída só a partir do brief: verdes limpos, muito branco, um gradiente seguro. O crítico de design apontou — parecia dashboard de SaaS corporativo, não uma fazenda de família.",
    es: "Una primera paleta construida solo a partir del brief: verdes limpios, mucho blanco, un degradado seguro. El crítico de diseño lo señaló — parecía un panel de SaaS corporativo, no una granja familiar."
  },
  "pipeline.proof.s1.call": {
    en: "I gave the colourist a set of reference photos — real produce, kraft paper, hand-painted stall signage — and had it rebuild the palette around those warm earth tones. Same step, re-run with better inputs.",
    pt: "Dei ao colorista um conjunto de imagens de referência — produtos reais, papel kraft, placas de banca pintadas à mão — e pedi que reconstruísse a paleta em torno desses tons terrosos e quentes. Mesma etapa, refeita com insumos melhores.",
    es: "Le di al colorista un conjunto de imágenes de referencia — productos reales, papel kraft, carteles de puesto pintados a mano — y le pedí que reconstruyera la paleta en torno a esos tonos tierra cálidos. Misma etapa, rehecha con mejores insumos."
  },
  "pipeline.proof.s1.before": { en: "First pass", pt: "Primeira versão", es: "Primera versión" },
  "pipeline.proof.s1.after": { en: "After curation", pt: "Depois da curadoria", es: "Después de la curaduría" },

  "pipeline.proof.s2.stage": {
    en: "UX · Wireframe",
    pt: "UX · Wireframe",
    es: "UX · Wireframe"
  },
  "pipeline.proof.s2.output": {
    en: "A standard e-commerce homepage: hero banner, then a product grid straight away — the layout the agent had seen a thousand times.",
    pt: "Uma homepage de e-commerce padrão: banner de destaque e, logo abaixo, uma grade de produtos — o layout que o agente já tinha visto mil vezes.",
    es: "Una homepage de e-commerce estándar: banner destacado y, justo debajo, una cuadrícula de productos — el layout que el agente había visto mil veces."
  },
  "pipeline.proof.s2.call": {
    en: "For a local farm, the customer's first question is “do you even deliver to me?”. I moved a delivery-radius check to the top of the wireframe, above the grid, so the answer comes before the browsing.",
    pt: "Para uma fazenda local, a primeira pergunta do cliente é “vocês entregam aqui?”. Movi uma verificação de raio de entrega para o topo do wireframe, acima da grade, para a resposta vir antes da navegação.",
    es: "Para una granja local, la primera pregunta del cliente es “¿me entregan a mí?”. Moví una verificación de radio de entrega a la parte superior del wireframe, encima de la cuadrícula, para que la respuesta llegue antes de navegar."
  },
  "pipeline.proof.s2.wf.hero": { en: "Hero", pt: "Hero", es: "Hero" },
  "pipeline.proof.s2.wf.grid": { en: "Product grid", pt: "Grade de produtos", es: "Cuadrícula de productos" },
  "pipeline.proof.s2.wf.radius": {
    en: "Delivery radius check",
    pt: "Verificação de raio de entrega",
    es: "Verificación de radio de entrega"
  },

  /* ─────────── 5 · FECHAMENTO ─────────── */
  "pipeline.cta.label": { en: "Contact", pt: "Contato", es: "Contacto" },
  "pipeline.cta.title": {
    en: "Let's <em>talk</em>",
    pt: 'Vamos <em>conversar</em>',
    es: 'Vamos a <em>hablar</em>'
  },
  /* founder = padrão (chegada via prospecção); hiring = processo seletivo (?ctx=hiring) */
  "pipeline.cta.body.founder": {
    en: "If you've got a project that needs speed without giving up quality, let's talk.",
    pt: "Se você tem um projeto que precisa de velocidade sem perder qualidade, vamos conversar.",
    es: "Si tienes un proyecto que necesita velocidad sin perder calidad, hablemos."
  },
  "pipeline.cta.body.hiring": {
    en: "This is the kind of system I bring into a team.",
    pt: "Esse é o tipo de sistema que eu trago para dentro de um time.",
    es: "Este es el tipo de sistema que llevo dentro de un equipo."
  },
  "pipeline.cta.btn.founder": {
    en: "Start a conversation on LinkedIn →",
    pt: "Começar uma conversa no LinkedIn →",
    es: "Iniciar una conversación en LinkedIn →"
  },
  "pipeline.cta.btn.hiring": {
    en: "Talk to me about the role →",
    pt: "Fale comigo sobre a vaga →",
    es: "Háblame sobre el puesto →"
  }
};
