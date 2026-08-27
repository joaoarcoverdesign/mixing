# Design System — Arcoverdesign v5
### Portfólio João Abdalla · Senior Product Designer

Este documento descreve o style guide usado em todo o portfólio (`index.html`, `about.html` e os case studies em `cases/`). O nome "Arcoverdesign v5" já aparece comentado no CSS original (`index.html`, linha 20) — é a versão atual do sistema visual.

Ver também: **`design.html`**, na mesma pasta, com todos os tokens e componentes renderizados visualmente.

---

## 1. Princípios

- **Dark-first.** Fundo quase-preto (`#11161A`) com um único acento verde-limão (`#C2FC50`) usado com moderação — nunca como cor de fundo em áreas grandes, sempre como destaque (bullet, sublinhado, número, borda, glow).
- **Duas famílias, dois papéis.** `Urbanist` (sans) carrega toda a UI e os títulos em caixa alta; `Lora` (serif, sempre itálico) é reservada para "voz humana" — subtítulos do hero, aspas, números de índice, palavras de ênfase dentro de um título.
- **Espaçamento fluido.** Quase nenhum valor fixo: `clamp()` em paddings, gaps e tamanhos de fonte, mais duas variáveis centrais (`--px`, `--ease`) reaproveitadas em todas as páginas.
- **Cards discretos.** Bordas de 1px translúcidas (`--line`) sobre `--surface`, nunca sombra pesada por padrão — o glow verde é o recurso de destaque, usado em blur pesado atrás do conteúdo.
- **Ícones = SVG inline.** Não há icon font nem biblioteca de ícones. Redes sociais e setas de navegação são paths SVG escritos à mão, `stroke="currentColor"` sempre que possível para herdar cor do componente pai.

---

## 2. Cores

### 2.1 Tokens principais (`index.html`, `about.html`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#11161A` | Fundo padrão das seções |
| `--bg-deep` | `#0C1013` | Fundo de seções "profundas" (work, footer, stats strip) e do nav com blur |
| `--surface` | `#1A2025` | Cards (`work-media`, `testi-card`, `portrait-badge`) |
| `--line` | `rgba(255,255,255,.08)` | Bordas sutis, divisores |
| `--accent` | `#C2FC50` | Único acento de cor — CTAs, bullets, glow, itálico de destaque |
| `--white` | `#F4F6F3` | Texto principal (não é branco puro) |
| `--muted` | `#9BA4AA` | Texto secundário (descrições, labels) |
| `--dim` | `#5E676D` | Texto terciário (footer, contadores) |

### 2.2 Variante dos case studies (`cases/*.html`)

Os case studies renomeiam os mesmos valores para uma nomenclatura mais semântica de "conteúdo longo", e somam tokens de estado e de raio de borda:

| Token | Valor | Equivale a | Uso |
|---|---|---|---|
| `--ink` | `#F4F6F3` | `--white` | Texto principal |
| `--ink-soft` | `#9BA4AA` | `--muted` | Texto secundário |
| `--ink-dim` | `#5E676D` | `--dim` | Labels, legendas |
| `--num-dim` | `#333B41` | — | Números grandes decorativos (ex.: índice de fase `01`, `02`) |
| `--line-soft` | `rgba(255,255,255,.05)` | — | Divisor ainda mais discreto |
| `--accent-soft` | `rgba(194,252,80,.12)` | — | Fundo de destaque suave |
| `--win` | `#6EE895` | — | Cards de aprendizado positivos (`.learn-card.win`) |
| `--challenge` | `#FBAE6C` | — | Cards de aprendizado / desafio (`.learn-card.challenge`) |
| `--radius-lg` | `16px` | — | Cards grandes (`next-card`) |
| `--radius-md` | `14px` | — | Cards médios (`highlight-block`, `insight-card`, `learn-card`) |

### 2.3 Cores de marca (redes sociais)

Fixas, não tokenizadas — usadas só no `.social-btn`:

| Rede | Cor |
|---|---|
| Dribbble | `#EA4C89` |
| Behance | `#1769FF` |
| LinkedIn | `#0A66C2` |

### 2.4 Regra de uso do acento

O verde `--accent` nunca preenche blocos grandes. Aparece em: bullet de 8px antes de `.sec-label`; sublinhado animado dos links do nav; texto dentro de `<i>` em números/stats; `<em>` dentro de títulos de seção; borda do `.portrait-frame`; ponto pulsante do `.status-dot`; glows radiais com opacidade 0.12–0.24 atrás de heros/cards.

---

## 3. Tipografia

```css
--serif: 'Lora', Georgia, serif;   /* sempre com font-style: italic */
--sans:  'Urbanist', sans-serif;   /* peso 300–800 */
```

Import (Google Fonts, carregado com `preconnect`):
```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,400;1,500;1,600&family=Urbanist:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### 3.1 Papéis

- **Urbanist 800, uppercase, tracking negativo (`-.02em` a `-.03em`)** — todos os títulos grandes (`hero2-title`, `sec-title`, `closing-title`, `work-name`). Tamanho sempre em `clamp()`.
- **Lora itálico 500** — subtítulos "de voz" (`hero2-sub`, `about-hero-lede`), citações (`testi-quote`, `about-quote blockquote`), a palavra de ênfase dentro de um `sec-title` (`<em>`), números de índice (`work-idx`, `chapter-idx`, `phase-num`).
- **Urbanist 600–700, uppercase, tracking positivo (`.06em`–`.24em`)** — todo texto de "label"/eyebrow (`sec-label`, `nav-links a`, `work-tags span`, `spec-label`).
- **Urbanist 400–500** — corpo de texto (`work-desc`, `chapter-text`, `contact-copy p`).

### 3.2 Escala (valores usados no projeto)

| Papel | Tamanho | Peso | Exemplo de classe |
|---|---|---|---|
| Display / hero title | `clamp(36px, 5.8vw, 72px)` | 800 | `.hero2-title` |
| Closing title | `clamp(34px, 6.4vw, 80px)` | 800 | `.closing-title` |
| Section title | `clamp(30px, 4.6vw, 58px)` | 800 | `.sec-title` |
| Case study title | `clamp(26px, 3.6vw, 40px)` | 800 | `.sec-title` (case study) |
| Hero sub (serif itálico) | `clamp(19px, 2.8vw, 30px)` | 500 | `.hero2-sub` |
| Stat número | `clamp(28px, 3.6vw, 44px)` | 800 | `.num` |
| Testimonial quote | `clamp(20px, 2.4vw, 28px)` | 500 (serif itálico) | `.testi-quote` |
| Corpo | `15–16.5px` | 400 | `.work-desc`, `.ov-text` |
| Label / eyebrow | `11–13px` | 600–800, uppercase, `letter-spacing .06–.24em` | `.sec-label`, `.spec-label` |

---

## 4. Espaçamento

Duas variáveis fazem quase todo o trabalho de layout:

```css
--px: clamp(20px, 5vw, 72px);            /* padding lateral fluido de toda seção/nav */
--ease: cubic-bezier(.22, 1, .36, 1);    /* easing único para toda transição/animação */
```

- **Padding lateral:** todo container usa `padding: … var(--px)` ou `.container{max-width:1160px;margin:0 auto;padding:0 var(--px)}`.
- **Padding vertical de seção:** `.sec-pad{padding:clamp(90px,14vh,150px) var(--px)}`.
- **Gaps de grid/flex:** também em `clamp()`, por ex. `.work-track{gap:clamp(24px,4vw,56px)}`, `.hero2-actions{gap:28px}`, `.about-stats-row{gap:clamp(28px,4vw,40px)}`.
- **Divisores:** `border-top:1px solid var(--line)` entre itens de lista (`.chapter`, `.phase`, `.a-stat`).
- Não há um "grid de 8px" declarado explicitamente — o espaçamento é fluido por design, mas os valores fixos que aparecem (gaps entre ícones, padding de pills, etc.) giram em torno de múltiplos de 4: `4, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 34, 40`.

---

## 5. Raio de borda

| Token / valor | Uso |
|---|---|
| `4px` | Mídia de work item (`.work-media`) |
| `14px` (`--radius-md`) | Cards médios de case study (`highlight-block`, `insight-card`, `learn-card`) |
| `16px` (`--radius-lg`) | Cards grandes de case study (`next-card`), `portrait-badge` |
| `28px` | Card grande de testimonial (`.testi-card`) |
| `50%` | Avatares, `social-btn`, `work-arrow`, `portrait-frame`, `status-dot`, bullet de `sec-label` |
| `99px` (pill) | Botão principal (`btn-main`), tags (`work-tags span`, `tag-pill`), `status-pill`, barra de progresso |

---

## 6. Sombra e glow

Não há uma escala formal de `box-shadow` — os valores são compostos caso a caso, mas seguem um padrão:

```css
/* sombra de elevação (cards, botão flutuante) */
box-shadow: 0 25px 70px rgba(0,0,0,.4);   /* testi-card */
box-shadow: 0 30px 60px rgba(0,0,0,.5);   /* portrait-frame */
box-shadow: 0 18px 40px rgba(0,0,0,.4);   /* portrait-badge */
box-shadow: 0 10px 24px rgba(0,0,0,.35);  /* social-btn:hover */

/* glow radial verde atrás de heros/CTAs — sempre blur alto, opacidade baixa */
background: radial-gradient(closest-side, rgba(194,252,80,.14), transparent 72%);
filter: blur(10px–50px);
```

Regra prática: **sombras neutras (`rgba(0,0,0,…)`) para profundidade; glow verde (`rgba(194,252,80,…)`) só atrás de elementos-âncora (hero, CTA, mockup, avatar).**

---

## 7. Ícones

Não há biblioteca (Lucide, Font Awesome etc.) nem sprite — cada ícone é um `<svg>` inline, desenhado à mão, dentro do próprio HTML:

- **Setas de navegação** (`work-arrow`, smooth-scroll): `viewBox="0 0 24 24"`, `stroke="currentColor"`, `stroke-width="2"`, `stroke-linecap/linejoin="round"` — herdam a cor do botão pai e ficam brancas sobre `--accent` no hover.
- **Logos de rede social** (`social-btn`): `viewBox="0 0 24 24"`, `fill="#fff"` fixo (o fundo colorido do botão é que muda, não o ícone).
- **Bullets/pontos decorativos** não são SVG — são `::before`/`::after` com `border-radius:50%` e `background:var(--accent)` (`sec-label::before`, `status-dot`).

Ao adicionar um ícone novo: usar SVG inline 24×24, herdar cor via `currentColor` sempre que o ícone estiver sobre um fundo variável (hover), e fixar a cor apenas em casos de marca (logos de terceiros).

---

## 8. Componentes

Abaixo, os componentes-chave com seu HTML/CSS de referência (extraídos do projeto). O `design.html` mostra todos eles renderizados lado a lado.

### 8.1 Botão primário — `.btn-main`
Pill verde-limão, texto escuro, com um "flair" branco que sobe por baixo no hover.
```html
<a class="btn-main" href="#work">
  <span class="flair"></span><span>View Case Studies</span>
</a>
```
```css
.btn-main{
  position:relative;display:inline-flex;align-items:center;gap:12px;
  background:var(--accent);color:var(--bg-deep);
  font-weight:700;font-size:15px;letter-spacing:.02em;
  padding:18px 34px;border-radius:99px;overflow:hidden;
  transition:transform .3s var(--ease);
}
.btn-main:hover{transform:translateY(-2px);}
.btn-main .flair{
  position:absolute;inset:0;background:var(--white);border-radius:inherit;
  transform:translateY(101%);transition:transform .45s var(--ease);
}
.btn-main:hover .flair{transform:translateY(0);}
.btn-main span{position:relative;z-index:1;}
```

### 8.2 Botão social circular — `.social-btn`
```html
<a class="social-btn linkedin" href="…" aria-label="LinkedIn"><svg>…</svg></a>
```
Cor de fundo fixa por rede (`.dribbble`, `.behance`, `.linkedin`); eleva 4px e ganha sombra no hover.

### 8.3 Cabeçalho de seção — `.sec-label` + `.sec-title`
```html
<span class="sec-label">Selected work</span>
<h2 class="sec-title">Results that made a <em>difference</em></h2>
```
`sec-label` = eyebrow uppercase com bullet verde; `sec-title` = título grande uppercase com uma palavra em `<em>` (Lora itálico, minúsculo, cor de acento) para dar o toque humano.

### 8.4 Tag / pill — `.work-tags span`, `.tag-pill`, `.status-pill`
```html
<div class="work-tags"><span>Enterprise</span><span>Design System</span></div>
```
Borda 1px `--line`, `border-radius:99px`, texto uppercase pequeno. `status-pill` é a mesma ideia + um `status-dot` pulsante à esquerda.

### 8.5 Bloco de estatística — `.m-stat`, `.a-stat`
```html
<div class="m-stat"><div class="num">600K→<i>10M+</i></div><div class="lab">Users on the platform</div></div>
```
Número grande (Urbanist 800) com a parte de destaque em `<i>` colorida de `--accent`; label pequeno uppercase abaixo.

### 8.6 Card de trabalho — `.work-item`
Mídia com `aspect-ratio` fixo + zoom leve no hover, índice em Lora itálico, título uppercase, descrição truncada em 2 linhas (`-webkit-line-clamp`), tags, link de fechamento em acento.

### 8.7 Card de depoimento — `.testi-card`
Card grande (`border-radius:28px`) com glow verde atrás, aspas gigantes em Lora, citação em serif itálico, e uma fileira de avatares sobrepostos (`margin-left:-14px`) onde o ativo escala e ganha borda de acento.

### 8.8 Selo flutuante — `.portrait-badge`
Card pequeno com `backdrop-filter: blur(8px)`, animação de flutuação (`float-badge`, 6s, alterna `translateY`), usado sobre o retrato em `about.html`.

### 8.9 Item de "capítulo" / lista numerada — `.chapter`, `.phase`
Grid de duas colunas (índice serif itálico + conteúdo), separado por `border-top:1px solid var(--line)`.

### 8.10 Cards de aprendizado com estado — `.learn-card.win` / `.learn-card.challenge`
Mesma estrutura de card, borda esquerda de 3px que muda de cor conforme o estado (`--win` verde-água / `--challenge` laranja) — único lugar do projeto com paleta de status além do acento principal.

### 8.11 Navegação — `nav` / `.nav-inner`
Fixa, com gradiente + `backdrop-filter:blur(12px)` para permanecer legível sobre qualquer conteúdo; some ao rolar para baixo e reaparece ao rolar para cima (`.is-hidden`).

### 8.12 Rodapé — `.foot-bottom`
Uma linha simples, `border-top:1px solid var(--line)`, fundo `--bg-deep`, texto em `--dim`.

---

## 9. Movimento

- **Easing único:** `--ease: cubic-bezier(.22,1,.36,1)` em praticamente toda transição do projeto.
- **Reveal on scroll:** classe `.rv` (opacity 0 + `translateY(32px)`) → `.rv.is-in` via `IntersectionObserver`, respeitando `prefers-reduced-motion`.
- **Kinetic canvas:** grade de pontos/linhas em `<canvas>` que se distorce em direção ao cursor e faz ripple no clique (usa `rgba(194,252,80,…)`, ou seja, o próprio `--accent`, como cor "ativa"). É um efeito de fundo, não um componente reutilizável de UI — mas segue a mesma paleta.
- **Hover padrão:** a maioria dos elementos interativos sobe (`translateY(-2px)` a `-4px`) e/ou troca borda/fundo para `--accent`.

---

## 10. Breakpoints usados

| Largura | Ajuste |
|---|---|
| `max-width:480px` | Esconde `.nav-role` |
| `max-width:560px` | Some com todos os links do nav exceto o último; some com `.portrait-badge` |
| `max-width:720px` | Reduz gap dos `.nav-links` |
| `max-width:760px` | `.about-stats-row` vira 2 colunas |
| `max-width:860px` | Vira grid de 1 coluna (`.contact-grid`) |
| `max-width:900px` | `.about-hero-grid` vira 1 coluna; `.hero2-sub` deixa de ser `nowrap` |
| `max-width:860px`, `pointer:coarse` | Desliga o scroll horizontal "pinned" de `.work` e volta a scroll nativo |

---

## 11. Arquivos de referência

- `index.html` — home (hero, work, testimonials, closing)
- `about.html` — página sobre (mesmos tokens, componentes extras: chapters, quote, contact)
- `cases/*.html` — case studies (tokens renomeados `--ink*`, + `--win`/`--challenge`, + `--radius-*`)
- `design.html` — style guide visual, gerado a partir deste documento
