/* LiquidReveal — hover líquido que revela uma segunda imagem (WebGL1 puro, sem dependências).
   Uso:
     var lr = new LiquidReveal({ canvas, container, imageAUrl, imageBUrl, ...opções });
     lr.resize(); lr.destroy();
   Extras além do núcleo:
     framingA / framingB  { scale, originX, originY } — zoom por camada (equivale a
                           transform: scale() + transform-origin), para alinhar fotos de
                           enquadramentos diferentes.
     radiusScale          multiplica o raio responsivo (containers pequenos pedem gota maior).
     onReady()            chamado quando as duas texturas carregaram e o 1º frame foi desenhado. */
(function (global) {
  "use strict";

  var TRAIL_COUNT = 24;

  var VERT = [
    "attribute vec2 a_position;",
    "varying vec2 v_uv;",
    "",
    "void main() {",
    "  v_uv = (a_position + 1.0) * 0.5;",
    "  v_uv.y = 1.0 - v_uv.y;",
    "  gl_Position = vec4(a_position, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG = `precision highp float;

varying vec2 v_uv;

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform vec2 u_resolution;
uniform vec2 u_image_resolution;
uniform vec2 u_image_resolution_b;
uniform vec3 u_framing_a;
uniform vec3 u_framing_b;
uniform vec2 u_trail[${TRAIL_COUNT}];
uniform float u_radii[${TRAIL_COUNT}];
uniform int u_trail_count;
uniform float u_speed;
uniform float u_time;
uniform float u_progress;
uniform float u_edge_softness;
uniform float u_noise_scale;
uniform float u_noise_strength;
uniform float u_noise_speed;
uniform float u_refraction_strength;

// --- Simplex Noise 2D — Ian McEwan, Ashima Arts (domínio público/MIT) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Ruído orgânico multi-oitava: 3 camadas derivando em direções diferentes.
float organicNoise(vec2 p, float time) {
  float n1 = snoise(p * u_noise_scale + vec2(time * u_noise_speed * 0.5, time * u_noise_speed * 0.3));
  float n2 = snoise(p * (u_noise_scale * 2.2) - vec2(time * u_noise_speed * 0.7, -time * u_noise_speed * 0.6));
  float n3 = snoise(p * (u_noise_scale * 4.4) + vec2(-time * u_noise_speed * 0.9, time * u_noise_speed * 0.8));
  return n1 * 0.6 + n2 * 0.3 + n3 * 0.1;
}

// Smooth minimum polinomial — funde os segmentos num "pescoço" contínuo (metaball).
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// SDF de cápsula entre A e B com raios variáveis (cone arredondado).
float capsuleSDF(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 ba = b - a;
  vec2 pa = p - a;
  float lenSq = dot(ba, ba);
  float h = lenSq > 1e-7 ? clamp(dot(pa, ba) / lenSq, 0.0, 1.0) : 0.0;
  float r = mix(ra, rb, h);
  return length(pa - ba * h) - r;
}

// Enquadramento "cover" por imagem + zoom (scale, origin) por camada.
vec2 frameUV(vec2 st, vec2 imageRes, vec3 framing, float canvasRatio) {
  float imageRatio = imageRes.x / imageRes.y;
  vec2 coverScale = vec2(
    canvasRatio < imageRatio ? canvasRatio / imageRatio : 1.0,
    canvasRatio < imageRatio ? 1.0 : imageRatio / canvasRatio
  );
  st = (st - framing.yz) / framing.x + framing.yz;
  return (st - 0.5) * coverScale + 0.5;
}

void main() {
  // 1. Enquadramento "cover" — imagem preenche o canvas sem distorcer
  float canvasRatio = u_resolution.x / u_resolution.y;

  // Espaço corrigido por aspecto: sem isso a gota vira elipse em tela wide
  vec2 aspect = vec2(canvasRatio, 1.0);
  vec2 p = v_uv * aspect;

  // 2. Campo de distância da trilha fluida
  float d = 1e5;

  for (int i = 0; i < ${TRAIL_COUNT - 1}; i++) {
    if (i >= u_trail_count - 1) break;
    vec2 pA = u_trail[i] * aspect;
    vec2 pB = u_trail[i+1] * aspect;
    float rA = u_radii[i];
    float rB = u_radii[i+1];

    if (rA < 0.0001 && rB < 0.0001) continue;

    float seg = capsuleSDF(p, pA, pB, rA, rB);
    d = (i == 0) ? seg : smin(d, seg, 0.045);
  }

  // 3. Respiração em repouso + deformação orgânica.
  float breathing = (sin(u_time * 2.2) * 0.012 + cos(u_time * 3.4) * 0.008) * (1.0 - min(u_speed * 4.0, 0.8));
  float noiseDisplacement = organicNoise(p, u_time) * u_noise_strength * (1.0 + u_speed * 0.8);

  float deformedDist = d - noiseDisplacement - breathing;

  // 4. Máscara de revelação
  float mask = 1.0 - smoothstep(-u_edge_softness, u_edge_softness, deformedDist);
  mask = clamp(mask * u_progress, 0.0, 1.0);

  // 5. Refração de menisco: só na faixa da borda.
  float edgeBand = smoothstep(0.0, 0.5, mask) * smoothstep(1.0, 0.5, mask);

  vec2 eps = vec2(0.01, 0.0);
  float nx = organicNoise(p + eps.xy, u_time) - organicNoise(p - eps.xy, u_time);
  float ny = organicNoise(p + eps.yx, u_time) - organicNoise(p - eps.yx, u_time);
  vec2 normalOffset = vec2(nx, ny) * u_refraction_strength * edgeBand;

  // Camadas refratam em intensidades diferentes -> sensação de profundidade
  vec2 uvA = clamp(frameUV(v_uv + normalOffset * 0.25, u_image_resolution, u_framing_a, canvasRatio), 0.0, 1.0);
  vec2 uvB = clamp(frameUV(v_uv + normalOffset * 0.7, u_image_resolution_b, u_framing_b, canvasRatio), 0.0, 1.0);

  vec4 colorA = texture2D(u_texA, uvA);
  vec4 colorB = texture2D(u_texB, uvB);

  gl_FragColor = mix(colorA, colorB, mask);
}`;

  var UNIFORMS = [
    "u_texA", "u_texB", "u_resolution", "u_image_resolution", "u_image_resolution_b",
    "u_framing_a", "u_framing_b", "u_trail", "u_radii", "u_trail_count", "u_speed",
    "u_time", "u_progress", "u_edge_softness", "u_noise_scale", "u_noise_strength",
    "u_noise_speed", "u_refraction_strength"
  ];

  function framing(f) {
    f = f || {};
    return [f.scale || 1, f.originX == null ? 0.5 : f.originX, f.originY == null ? 0.5 : f.originY];
  }

  function LiquidReveal(opts) {
    this.canvas = opts.canvas;
    this.container = opts.container;
    this.onReady = opts.onReady || null;

    this.radius = opts.radius != null ? opts.radius : 0.075;
    this.radiusScale = opts.radiusScale || 1;
    this.fixedRadius = opts.radius != null;
    this.edgeSoftness = opts.edgeSoftness != null ? opts.edgeSoftness : 0.024;
    this.noiseScale = opts.noiseScale != null ? opts.noiseScale : 2.8;
    this.noiseStrength = opts.noiseStrength != null ? opts.noiseStrength : 0.035;
    this.noiseSpeed = opts.noiseSpeed != null ? opts.noiseSpeed : 0.65;
    this.mouseDamping = opts.mouseDamping != null ? opts.mouseDamping : 0.22;
    this.trailDamping = opts.trailDamping != null ? opts.trailDamping : 0.42;
    this.refractionStrength = opts.refractionStrength != null ? opts.refractionStrength : 0.012;
    this.framingA = framing(opts.framingA);
    this.framingB = framing(opts.framingB);

    var reduced = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      this.noiseSpeed = 0.1;
      this.noiseStrength = 0.01;
      this.mouseDamping = 0.35;
    }

    this.trailPoints = [];
    for (var i = 0; i < TRAIL_COUNT; i++) this.trailPoints.push({ x: 0.5, y: 0.5 });
    this.trailArray = new Float32Array(TRAIL_COUNT * 2);
    this.radiiArray = new Float32Array(TRAIL_COUNT);
    this.targetMouse = { x: 0.5, y: 0.5 };
    this.prevHead = { x: 0.5, y: 0.5 };
    this.currentSpeed = 0;
    this.currentProgress = 0;
    this.isHovered = false;
    this.isVisible = true;
    this.texturesReady = 0;
    this.needsDraw = true;
    this.startTime = performance.now();
    this.raf = 0;

    this.gl = this.canvas.getContext("webgl", {
      alpha: false, antialias: true, depth: false, stencil: false,
      powerPreference: "high-performance", preserveDrawingBuffer: false
    });
    if (!this.gl) {
      console.warn("[LiquidReveal] WebGL indisponível — mantendo a imagem estática.");
      this.failed = true;
      return;
    }

    this._initGL();
    this._bindEvents();
    this.resize();
    this._loadTexture(opts.imageAUrl, 0, "texA");
    this._loadTexture(opts.imageBUrl, 1, "texB");
    this._loop = this._loop.bind(this);
    this.raf = requestAnimationFrame(this._loop);
  }

  LiquidReveal.prototype._compile = function (type, src) {
    var gl = this.gl;
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error("[LiquidReveal] shader: " + gl.getShaderInfoLog(sh));
    }
    return sh;
  };

  LiquidReveal.prototype._initGL = function () {
    var gl = this.gl;
    var vs = this._compile(gl.VERTEX_SHADER, VERT);
    var fs = this._compile(gl.FRAGMENT_SHADER, FRAG);
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error("[LiquidReveal] link: " + gl.getProgramInfoLog(prog));
    }
    this.program = prog;
    gl.useProgram(prog);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var u = (this.u = {});
    UNIFORMS.forEach(function (name) { u[name] = gl.getUniformLocation(prog, name); });

    gl.uniform1i(u.u_texA, 0);
    gl.uniform1i(u.u_texB, 1);
    gl.uniform1i(u.u_trail_count, TRAIL_COUNT);
    gl.uniform3fv(u.u_framing_a, this.framingA);
    gl.uniform3fv(u.u_framing_b, this.framingB);
    gl.uniform2f(u.u_image_resolution, 1, 1);
    gl.uniform2f(u.u_image_resolution_b, 1, 1);
  };

  LiquidReveal.prototype._loadTexture = function (url, unit, key) {
    var self = this;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      if (self.destroyed) return;
      var gl = self.gl;
      var tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      self[key] = tex;
      gl.uniform2f(unit === 0 ? self.u.u_image_resolution : self.u.u_image_resolution_b,
        img.naturalWidth, img.naturalHeight);
      self.texturesReady++;
      self.needsDraw = true;
    };
    img.onerror = function () {
      console.warn("[LiquidReveal] falha ao carregar " + url + " (CORS ou caminho inválido).");
    };
    img.src = url;
  };

  LiquidReveal.prototype._bindEvents = function () {
    var self = this;
    var el = this.container;
    var opt = { passive: true };

    function setTarget(clientX, clientY) {
      var r = el.getBoundingClientRect();
      self.targetMouse.x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      self.targetMouse.y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    }
    // Colapsa a trilha na entrada — evita o "chicote" da última posição até o cursor.
    function enter(clientX, clientY) {
      setTarget(clientX, clientY);
      for (var i = 0; i < TRAIL_COUNT; i++) {
        self.trailPoints[i].x = self.targetMouse.x;
        self.trailPoints[i].y = self.targetMouse.y;
      }
      self.prevHead.x = self.targetMouse.x;
      self.prevHead.y = self.targetMouse.y;
      self.currentSpeed = 0;
      self.isHovered = true;
    }

    this._handlers = {
      mouseenter: function (e) { enter(e.clientX, e.clientY); },
      mousemove: function (e) {
        if (!self.isHovered) enter(e.clientX, e.clientY);
        else setTarget(e.clientX, e.clientY);
      },
      mouseleave: function () { self.isHovered = false; },
      touchstart: function (e) { var t = e.touches[0]; if (t) enter(t.clientX, t.clientY); },
      touchmove: function (e) { var t = e.touches[0]; if (t) setTarget(t.clientX, t.clientY); },
      touchend: function () { self.isHovered = false; }
    };
    for (var type in this._handlers) el.addEventListener(type, this._handlers[type], opt);

    this._onResize = function () { self.resize(); };
    if (global.ResizeObserver) {
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(el);
    } else {
      global.addEventListener("resize", this._onResize);
    }

    // Fora da tela não há por que desenhar.
    if (global.IntersectionObserver) {
      this._io = new IntersectionObserver(function (entries) {
        self.isVisible = entries[0].isIntersecting;
      });
      this._io.observe(el);
    }
  };

  LiquidReveal.prototype.resize = function () {
    if (!this.gl) return;
    var w = this.container.clientWidth;
    var h = this.container.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.u.u_resolution, this.canvas.width, this.canvas.height);

    if (!this.fixedRadius) {
      var vw = global.innerWidth;
      var base = vw < 768 ? 0.095 : vw < 1200 ? 0.082 : 0.072;
      this.radius = base * this.radiusScale;
    }
    this.needsDraw = true;
  };

  LiquidReveal.prototype._loop = function () {
    this.raf = requestAnimationFrame(this._loop);
    if (this.texturesReady < 2 || !this.isVisible) return;

    var pts = this.trailPoints;

    // A) Cabeça persegue o mouse
    var head = pts[0];
    head.x += (this.targetMouse.x - head.x) * this.mouseDamping;
    head.y += (this.targetMouse.y - head.y) * this.mouseDamping;

    // B) Velocidade suavizada
    var dx = head.x - this.prevHead.x;
    var dy = head.y - this.prevHead.y;
    var instantSpeed = Math.sqrt(dx * dx + dy * dy);
    this.currentSpeed += (instantSpeed - this.currentSpeed) * 0.25;
    this.prevHead.x = head.x;
    this.prevHead.y = head.y;

    // C) Corrente elástica — damping cresce ao longo da cauda
    for (var i = 1; i < TRAIL_COUNT; i++) {
      var damping = Math.min(0.55, this.trailDamping + (i / TRAIL_COUNT) * 0.08);
      pts[i].x += (pts[i - 1].x - pts[i].x) * damping;
      pts[i].y += (pts[i - 1].y - pts[i].y) * damping;
    }

    // D) Progresso — entra rápido, sai devagar
    if (this.isHovered) this.currentProgress += (1 - this.currentProgress) * 0.16;
    else this.currentProgress += (0 - this.currentProgress) * 0.09;
    if (this.currentProgress < 0.0001 && !this.isHovered) this.currentProgress = 0;

    // Em repouso total a imagem A é estática: desenha uma vez e para.
    if (this.currentProgress === 0 && !this.isHovered && !this.needsDraw) return;
    this.needsDraw = false;

    // E) Raios afinando + expansão por velocidade
    var speedExpansion = 1 + Math.min(this.currentSpeed * 12, 0.45);
    for (var j = 0; j < TRAIL_COUNT; j++) {
      this.trailArray[j * 2] = pts[j].x;
      this.trailArray[j * 2 + 1] = pts[j].y;
      var t = j / (TRAIL_COUNT - 1);
      this.radiiArray[j] = this.radius * Math.pow(1 - t, 1.15) * speedExpansion;
    }

    // F) Uniforms + draw
    var gl = this.gl, u = this.u;
    gl.uniform2fv(u.u_trail, this.trailArray);
    gl.uniform1fv(u.u_radii, this.radiiArray);
    gl.uniform1f(u.u_speed, this.currentSpeed);
    gl.uniform1f(u.u_time, (performance.now() - this.startTime) / 1000);
    gl.uniform1f(u.u_progress, this.currentProgress);
    gl.uniform1f(u.u_edge_softness, this.edgeSoftness);
    gl.uniform1f(u.u_noise_scale, this.noiseScale);
    gl.uniform1f(u.u_noise_strength, this.noiseStrength);
    gl.uniform1f(u.u_noise_speed, this.noiseSpeed);
    gl.uniform1f(u.u_refraction_strength, this.refractionStrength);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (this.onReady) {
      var cb = this.onReady;
      this.onReady = null;
      cb();
    }
  };

  LiquidReveal.prototype.destroy = function () {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    if (this._handlers) {
      for (var type in this._handlers) this.container.removeEventListener(type, this._handlers[type]);
    }
    if (this._ro) this._ro.disconnect();
    else if (this._onResize) global.removeEventListener("resize", this._onResize);
    if (this._io) this._io.disconnect();
    var gl = this.gl;
    if (gl) {
      if (this.texA) gl.deleteTexture(this.texA);
      if (this.texB) gl.deleteTexture(this.texB);
      if (this.buffer) gl.deleteBuffer(this.buffer);
      if (this.program) gl.deleteProgram(this.program);
    }
  };

  global.LiquidReveal = LiquidReveal;
})(window);
