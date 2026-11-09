/* Shared koi animation: call initKoi(canvas, section) */
/* koi: top-down, follows the pointer with a slow, fluid swim.
   After the visitor opens 2 case studies (counted in analytics.js, localStorage
   "koi.cases"), an orange companion joins and swims beside it.
   opts.stain: an element (the hero headline) that the koi "paints" as it swims
   under it: a canvas over the section with mix-blend-mode:darken draws the fish
   inside that element's box and fades it out, so the pattern shows only on the
   white letters (darken leaves the dark background untouched). */
/* click a fish and it transforms into a Chinese dragon (same palette, same top-down
   view, same drawing style, same head size); click again and it turns back. A band
   of light sweeps from head to tail and each part of the body changes as the light
   passes it: mk(f, k) is the dragon amount (0 koi .. 1 dragon) at body position k.
   As a dragon the green one chases a pearl that sits on the cursor. */
function initKoi(canvas, section, opts) {
  if (!canvas) return;
  /* no cursor to follow on touch devices / phones: hide the koi entirely */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.innerWidth < 768) { canvas.style.display = "none"; return; }
  var ctx = canvas.getContext("2d"), dpr = 1, W = 0, H = 0, visible = true;
  var off = document.createElement("canvas"), octx = off.getContext("2d");
  var N = 28, SEG = 7, mouse = null, inside = false, last = 0, t = 0, ft = 0;
  var stainEl = opts && opts.stain, sc = null, sctx = null, stainIdle = 0, STAIN_FADE = 0.7;
  if (stainEl) {
    sc = document.createElement("canvas");
    sc.className = "koi-stain"; sc.setAttribute("aria-hidden", "true");
    sc.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;mix-blend-mode:darken";
    section.appendChild(sc);
    sctx = sc.getContext("2d");
  }
  function resize() {
    var r = section.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = off.width = W * dpr; canvas.height = off.height = H * dpr;
    if (sc) { sc.width = W * dpr; sc.height = H * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  /* cases seen so far, and whether the companion has already been met once */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var seen = 0;
  try { seen = (JSON.parse(lsGet("koi.cases") || "[]") || []).length; } catch (e) {}
  var unlocked = seen >= 2, entering = unlocked && !lsGet("koi.met");
  if (unlocked) lsSet("koi.met", "1");

  var GREEN = {
    body0: "rgb(38,92,32)", body1: "rgb(26,66,24)", patch: "rgba(122,204,64,.95)",
    fin: "rgba(74,146,52,.55)", ray: "rgba(170,236,120,.28)", rim: "rgba(6,22,8,.45)",
    dorsal: "rgba(10,34,12,.6)", dorsalHi: "rgba(170,236,120,.22)",
    barbel: "rgba(122,204,64,.75)", eye: "rgba(190,250,130,.9)", pupil: "rgb(8,18,8)"
  };
  var ORANGE = {
    body0: "rgb(176,78,18)", body1: "rgb(124,50,12)", patch: "rgba(255,158,64,.95)",
    fin: "rgba(222,112,40,.55)", ray: "rgba(255,206,150,.28)", rim: "rgba(34,12,2,.45)",
    dorsal: "rgba(52,18,4,.6)", dorsalHi: "rgba(255,206,150,.22)",
    barbel: "rgba(255,158,64,.75)", eye: "rgba(255,224,176,.9)", pupil: "rgb(20,8,2)"
  };
  /* a = heading, v = starting speed along it; the body trails straight behind */
  function makeFish(col, scale, x, y, ph, flip, a, v) {
    a = a || 0; v = v || 0;
    var f = { col: col, scale: scale, ph: ph, flip: flip, spine: [],
      m: 0, s: 0, dragon: false, from: 0, to: 0, t0: null, burst: 0,
      head: { x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, a: a } };
    for (var i = 0; i < N; i++) f.spine.push({ x: x - Math.cos(a) * i * SEG, y: y - Math.sin(a) * i * SEG });
    return f;
  }
  var SCALE = 0.7, SHADOW = { x: 18, y: 26 };
  /* starts just above the top edge, already swimming down, so it shows up right away */
  var DOWN = Math.PI / 2;
  var koi = makeFish(GREEN, SCALE, W * 0.42, -20, 0, 1, DOWN, 90), mate = null;
  if (unlocked) {
    var mx = entering ? (koi.head.x < W / 2 ? -80 : W + 80) : koi.head.x + 60;
    mate = makeFish(ORANGE, 0.6, mx, entering ? 60 : -70, 1.7, -1, entering ? 0 : DOWN, entering ? 0 : 90);
  }

  window.addEventListener("resize", resize);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(section);
  window.addEventListener("mousemove", function (e) {
    var r = section.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top, at: performance.now() };
    inside = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= W && mouse.y <= H;
  }, { passive: true });
  document.addEventListener("mouseleave", function () { inside = false; });
  window.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("a,button,input,textarea,select,label,[role=button]")) return;
    var r = section.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top, at: performance.now() };
    inside = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= W && mouse.y <= H;
    var f = over(koi) ? koi : mate && over(mate) ? mate : null;
    if (f) transform(f);
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(section);
  }

  /* ── tooltip: canvas ignores the pointer, so hover is hit-tested on the spine ── */
  if (!document.getElementById("koi-tip-css")) {
    var css = document.createElement("style");
    css.id = "koi-tip-css";
    css.textContent =
      ".koi-tip{position:absolute;left:0;top:0;z-index:5;pointer-events:none;max-width:230px;" +
      "padding:10px 14px;border-radius:12px;background:var(--surface,#1A2025);" +
      "border:1px solid var(--line,rgba(255,255,255,.08));color:var(--ink,#F4F6F3);" +
      "font:600 13px/1.45 var(--sans,'Urbanist',sans-serif);text-align:center;" +
      "box-shadow:0 10px 30px rgba(0,0,0,.35);opacity:0;transition:opacity .25s;will-change:transform}" +
      ".koi-tip.is-on{opacity:1}" +
      ".koi-tip b{color:var(--accent,#C2FC50);font-weight:800;margin-left:6px;white-space:nowrap}";
    document.head.appendChild(css);
  }
  if (getComputedStyle(section).position === "static") section.style.position = "relative";
  var tip = document.createElement("div");
  tip.className = "koi-tip"; tip.setAttribute("role", "status");
  section.appendChild(tip);
  var tipKey = "", hoverAt = 0, leaveAt = 0, tipOn = false, forceUntil = 0, met = !entering;
  function tr(k, fb) { return (window.I18N && window.I18N.t(k)) || fb; }
  function renderTip() {
    var key = unlocked ? "done" : seen >= 1 ? "one" : "need";
    var lang = window.I18N ? window.I18N.lang : "";
    if (key + lang === tipKey) return;
    tipKey = key + lang;
    var txt = key === "done" ? tr("koi.tip.done", "Thank you! Now I swim with company.")
      : key === "one" ? tr("koi.tip.one", "Just one more case study until she arrives.")
      : tr("koi.tip.need", "I need a companion. Visit 2 case studies.");
    tip.textContent = txt;
    if (!unlocked) {
      var b = document.createElement("b");
      b.textContent = Math.min(seen, 2) + "/2";
      tip.appendChild(b);
    }
  }
  function over(f) { /* cursor near the drawn (scaled) body */
    if (!mouse || !inside) return false;
    var h = f.spine[0];
    for (var i = 0; i <= 18; i += 2) {
      var p = f.spine[i], x = h.x + (p.x - h.x) * f.scale, y = h.y + (p.y - h.y) * f.scale;
      if (Math.hypot(mouse.x - x, mouse.y - y) < 22) return true;
    }
    return false;
  }
  var hoverCursor = false;
  function updateTip(now) {
    var hit = over(koi) ? koi : mate && over(mate) ? mate : null;
    if (!!hit !== hoverCursor) { hoverCursor = !!hit; section.style.cursor = hit ? "pointer" : ""; }
    if (hit) { if (!hoverAt) hoverAt = now; leaveAt = 0; }
    else { if (!leaveAt) leaveAt = now; hoverAt = 0; }
    var show = (hit && now - hoverAt > 250) || (tipOn && !hit && now - leaveAt < 400) || now < forceUntil;
    if (show) {
      renderTip();
      var a = hit || koi, x = Math.max(120, Math.min(W - 120, a.spine[0].x));
      tip.style.transform = "translate(" + Math.round(x) + "px," + Math.round(a.spine[0].y - 34) + "px) translate(-50%,-100%)";
    }
    if (show !== tipOn) { tipOn = show; tip.classList.toggle("is-on", show); }
  }

  function width(k) { /* 0 snout .. 1 tail stalk: rounded head, widest behind the pectorals */
    if (k < 0.12) { var u = 1 - k / 0.12; return 17 * Math.sqrt(1 - u * u); }
    if (k < 0.3) return 17 + 3 * Math.sin((k - 0.12) / 0.18 * Math.PI / 2);
    if (k < 0.88) return 4.2 + 15.8 * (0.5 + 0.5 * Math.cos(Math.PI * (k - 0.3) / 0.58));
    return 4.2 - (k - 0.88) / 0.12 * 1.2;
  }
  /* dragon: long serpent. Head as wide as the koi's (17), a neck, then a slow taper */
  function widthD(k) {
    if (k < 0.1) { var u = 1 - k / 0.1; return 17 * Math.sqrt(1 - u * u); }
    if (k < 0.16) return 17 - 5 * Math.sin((k - 0.1) / 0.06 * Math.PI / 2);
    if (k < 0.3) return 12 + 3 * Math.sin((k - 0.16) / 0.14 * Math.PI / 2);
    return 15 - 10.5 * (k - 0.3) / 0.7;
  }
  function wAt(k, m) { return width(k) * (1 - m) + widthD(k) * m; }
  var SEGD = 10.5, MORPH_MS = 1500, BAND = 0.18;
  /* dragon amount at body position k (0 head .. 1 tail) while the light sweeps */
  function mk(f, k) {
    if (f.t0 === null) return f.m;
    var l = (f.s * (1 + BAND) - k) / BAND;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    return f.from + (f.to - f.from) * l;
  }
  function frontK(f) { return Math.max(0, Math.min(1, f.s * (1 + BAND) - BAND / 2)); }
  function spineAt(f, k) {
    var x = k * (N - 1), i = Math.min(N - 2, Math.floor(x)), u = x - i, a = f.spine[i], b = f.spine[i + 1];
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, i: i };
  }

  /* transformation: eased morph + a writhe, a flash and a spark burst */
  var parts = [], rings = [];
  function spark(f, slow, at) {
    var h = f.spine[0], p = at || f.spine[Math.floor(Math.random() * N)];
    var a = Math.random() * 6.283, v = slow ? 15 + Math.random() * 40 : 40 + Math.random() * 130;
    parts.push({ x: h.x + (p.x - h.x) * f.scale, y: h.y + (p.y - h.y) * f.scale,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 0.6 + Math.random() * 0.7,
      r: 1.2 + Math.random() * 2.4, c: [f.col.patch, f.col.eye, "rgba(255,255,255,.95)"][parts.length % 3] });
  }
  function transform(f) {
    if (f.t0 !== null) return; /* let a sweep finish before the next one */
    f.dragon = !f.dragon; f.from = f.m; f.to = f.dragon ? 1 : 0; f.t0 = performance.now(); f.s = 0;
    for (var j = 0; j < 16; j++) spark(f, false, f.spine[0]);
    var h = f.spine[0];
    rings.push({ x: h.x, y: h.y, life: 0, col: f.col.patch });
  }
  function morph(f, now) {
    if (f.t0 === null) return;
    var p = Math.min(1, (now - f.t0) / MORPH_MS);
    f.s = 0.5 - 0.5 * Math.cos(Math.PI * p);
    f.m = f.from + (f.to - f.from) * f.s;
    f.burst = Math.sin(Math.PI * p);
    var fp = spineAt(f, frontK(f));
    spark(f, true, fp); spark(f, false, fp);
    if (p >= 1) { f.t0 = null; f.burst = 0; f.m = f.to; f.s = 0; }
  }
  function drawFx(dt) {
    if (!parts.length && !rings.length) return;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    parts = parts.filter(function (p) { return (p.life += dt) < p.max; });
    parts.forEach(function (p) {
      var k = 1 - p.life / p.max;
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.95; p.vy *= 0.95;
      ctx.globalAlpha = k; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (0.4 + 0.6 * k), 0, 6.283); ctx.fill();
    });
    rings = rings.filter(function (r) { return (r.life += dt) < 0.9; });
    rings.forEach(function (r) {
      var q = r.life / 0.9, e = 1 - Math.pow(1 - q, 3);
      ctx.globalAlpha = (1 - q) * 0.8; ctx.strokeStyle = r.col; ctx.lineWidth = 2.5 * (1 - q) + 0.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, 10 + 60 * e, 0, 6.283); ctx.stroke();
    });
    ctx.restore();
  }
  /* the pearl a dragon chases: it rides on the cursor */
  function drawPearl(now) {
    if (koi.m < 0.05 || !mouse || !inside || now - mouse.at > 4000) return;
    var a = Math.min(1, koi.m * 1.4), r = 7 + Math.sin(t * 3) * 0.8, x = mouse.x, y = mouse.y;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.8);
    g.addColorStop(0, "rgba(255,255,255," + a.toFixed(3) + ")");
    g.addColorStop(0.35, "rgba(214,255,160," + (a * 0.85).toFixed(3) + ")");
    g.addColorStop(1, "rgba(122,204,64,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.8, 0, 6.283); ctx.fill();
    var oa = t * 2.2;
    ctx.globalAlpha = a; ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.beginPath(); ctx.arc(x + Math.cos(oa) * r * 2, y + Math.sin(oa) * r * 2, 1.4, 0, 6.283); ctx.fill();
    ctx.restore();
  }

  /* head velocity smoothing, heading and the swaying spine — shared by both fish */
  function swim(f, dvx, dvy, dt) {
    var head = f.head, spine = f.spine, k = 1 - Math.exp(-dt * 2);
    head.vx += (dvx - head.vx) * k; head.vy += (dvy - head.vy) * k;
    head.x += head.vx * dt; head.y += head.vy * dt;
    var speed = Math.hypot(head.vx, head.vy);
    if (speed > 4) {
      var ta = Math.atan2(head.vy, head.vx), da = ta - head.a;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      head.a += da * (1 - Math.exp(-dt * 3));
    }
    var amp0 = 0.5 + Math.min(1, speed / 60) * 0.9;
    var freq = 1.8 + Math.min(1, speed / 90) * 1.6, ts = t + f.ph;
    var p0 = spine[0];
    p0.x = head.x; p0.y = head.y;
    for (var i = 1; i < N; i++) {
      var p = spine[i], q = spine[i - 1], ang = Math.atan2(p.y - q.y, p.x - q.x);
      var mi = mk(f, i / (N - 1)), seg = SEG + (SEGD - SEG) * mi;
      var amp = amp0 * (1 + 1.3 * mi) + f.burst * 0.8;
      var sway = Math.sin(ts * freq - i * (0.38 - 0.1 * mi)) * 0.022 * amp * (i / N + 0.3);
      ang += sway * (i > 1 ? 1 : 0);
      p.x = q.x + Math.cos(ang) * seg; p.y = q.y + Math.sin(ang) * seg;
    }
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; t += dt;
    var head = koi.head, tx, ty, wander = !mouse || now - mouse.at > 4000;
    if (wander) { tx = W * (0.5 + 0.32 * Math.sin(t * 0.21)); ty = H * (0.5 + 0.3 * Math.sin(t * 0.17 + 1.3)); }
    else { tx = mouse.x; ty = mouse.y; }
    var dx = tx - head.x, dy = ty - head.y, dist = Math.hypot(dx, dy) || 1;
    var maxSp = (wander ? 50 : 130) * (1 + 0.3 * koi.m), sp = maxSp * Math.min(1, Math.max(0, (dist - 50) / 260));
    if (!wander && dist < 50) sp = 10;
    morph(koi, now); if (mate) morph(mate, now);
    swim(koi, dx / dist * sp, dy / dist * sp, dt);
    if (mate) {
      /* companion: a point beside and a little behind the green koi, drifting slowly */
      var a = head.a, side = 46 + 14 * Math.sin(t * 0.4), back = 34 + 12 * Math.sin(t * 0.27 + 1);
      var mtx = head.x - Math.cos(a) * back + Math.cos(a + Math.PI / 2) * side;
      var mty = head.y - Math.sin(a) * back + Math.sin(a + Math.PI / 2) * side;
      var mdx = mtx - mate.head.x, mdy = mty - mate.head.y;
      var mvx = head.vx + mdx * 1.2, mvy = head.vy + mdy * 1.2, mv = Math.hypot(mvx, mvy), cap = 190;
      if (mv > cap) { mvx *= cap / mv; mvy *= cap / mv; }
      swim(mate, mvx, mvy, dt);
      if (!met && Math.hypot(mate.head.x - head.x, mate.head.y - head.y) < 110) { met = true; forceUntil = now + 3000; }
    }
    draw();
    drawFx(dt);
    drawPearl(now);
    stain(dt);
    updateTip(now);
  }
  /* headline paint: fade what's there, then stamp the fish again while it's under the text */
  function stain(dt) {
    if (!sc) return;
    var s = section.getBoundingClientRect(), r = stainEl.getBoundingClientRect();
    var x = r.left - s.left, y = r.top - s.top, w = r.width, h = r.height, pad = 45;
    var fish = mate ? [mate, koi] : [koi];
    var hit = fish.some(function (f) {
      for (var i = 0; i < N; i += 3) {
        var p = f.spine[i];
        if (p.x > x - pad && p.x < x + w + pad && p.y > y - pad && p.y < y + h + pad) return true;
      }
      return false;
    });
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!hit) {
      stainIdle += dt;
      /* 8-bit alpha never quite reaches 0 with destination-out, so wipe once it's faded */
      if (stainIdle > STAIN_FADE * 5) { if (stainIdle - dt <= STAIN_FADE * 5) sctx.clearRect(0, 0, W, H); return; }
    } else stainIdle = 0;
    sctx.globalCompositeOperation = "destination-out";
    sctx.fillStyle = "rgba(0,0,0," + (1 - Math.exp(-dt / STAIN_FADE)).toFixed(3) + ")";
    sctx.fillRect(0, 0, W, H);
    sctx.globalCompositeOperation = "source-over";
    if (!hit) return;
    sctx.save();
    sctx.beginPath(); sctx.rect(x, y, w, h); sctx.clip();
    fish.forEach(function (f) { place(sctx, f, false); });
    sctx.restore();
  }
  function normals(f) {
    var out = [], spine = f.spine;
    for (var i = 0; i < N; i++) {
      var a = spine[Math.max(0, i - 1)], b = spine[Math.min(N - 1, i + 1)];
      var tail = Math.atan2(b.y - a.y, b.x - a.x); /* direction toward the tail */
      out.push({ nx: Math.cos(tail + Math.PI / 2), ny: Math.sin(tail + Math.PI / 2), ang: tail });
    }
    return out;
  }
  /* rounded, fan-shaped fin: base at origin, pointing along +x */
  function finShape(c, x, y, ang, len, wid, rays) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, -wid * 0.16);
    c.bezierCurveTo(len * 0.3, -wid * 0.72, len * 0.92, -wid * 0.62, len, -wid * 0.05);
    c.bezierCurveTo(len * 0.96, wid * 0.5, len * 0.4, wid * 0.62, 0, wid * 0.16);
    c.closePath(); c.fill();
    if (rays) {
      c.strokeStyle = rays; c.lineWidth = 0.9;
      for (var r = -2; r <= 2; r++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(len * 0.9, r * wid * 0.2); c.stroke(); }
    }
    c.restore();
  }
  /* forked caudal fin with two flowing lobes */
  function tailShape(c, x, y, ang, rays, k) {
    k = k === undefined ? 1 : k;
    var tl = 50 * k, tw = 25 * k, s1 = Math.sin(ft * 2 - 1) * 6 * k, s2 = Math.sin(ft * 2 - 1.7) * 5 * k;
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, -3.5);
    c.bezierCurveTo(tl * 0.35, -tw * 0.35, tl * 0.7, -tw * 0.78 + s1, tl, -tw + s1 * 1.4);
    c.bezierCurveTo(tl * 0.86, -tw * 0.45 + s1, tl * 0.72, -tw * 0.12 + s2, tl * 0.62, s2);
    c.bezierCurveTo(tl * 0.72, tw * 0.12 + s2, tl * 0.86, tw * 0.45 + s1, tl, tw + s1 * 1.4);
    c.bezierCurveTo(tl * 0.7, tw * 0.78 + s1, tl * 0.35, tw * 0.35, 0, 3.5);
    c.closePath(); c.fill();
    if (rays) {
      c.strokeStyle = rays; c.lineWidth = 0.9;
      for (var r = -3; r <= 3; r++) { if (!r) continue; c.beginPath(); c.moveTo(2, 0); c.lineTo(tl * 0.92, r / 3 * tw * 0.9 + (Math.abs(r) / 3) * s1); c.stroke(); }
    }
    c.restore();
  }
  function bodyPath(c, spine, nm, f, fish) {
    var i, w, k;
    c.beginPath();
    for (i = 0; i < N; i++) { k = i / (N - 1); w = wAt(k, mk(fish, k)) * f; i ? c.lineTo(spine[i].x + nm[i].nx * w, spine[i].y + nm[i].ny * w) : c.moveTo(spine[i].x + nm[i].nx * w, spine[i].y + nm[i].ny * w); }
    for (i = N - 1; i >= 0; i--) { k = i / (N - 1); w = wAt(k, mk(fish, k)) * f; c.lineTo(spine[i].x - nm[i].nx * w, spine[i].y - nm[i].ny * w); }
    c.closePath();
  }
  /* irregular patches built from overlapping blobs: spine index, lateral (-1..1), radius */
  var PATCH = [
    [1, 0, 10], [2, 0.25, 11], [3, -0.15, 10],
    [6, 0.4, 11], [7, 0.55, 9], [8, 0.2, 10], [7, -0.55, 6],
    [11, -0.4, 11], [12, -0.05, 10], [13, -0.5, 8], [12, 0.65, 5],
    [16, 0.3, 8], [17, 0.1, 7.5], [18, 0.4, 6],
    [21, -0.25, 5.5], [22, 0, 4.5]
  ];
  /* flame-like leaf: mane tufts and the dragon's tail plume */
  function leaf(c, x, y, ang, len, wid, curl) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, -wid * 0.5);
    c.bezierCurveTo(len * 0.4, -wid, len * 0.8, -wid * 0.4 + curl, len, curl);
    c.bezierCurveTo(len * 0.7, wid * 0.3 + curl * 0.5, len * 0.35, wid * 0.8, 0, wid * 0.5);
    c.closePath(); c.fill(); c.restore();
  }
  /* four clawed legs paddling in a walk cycle */
  function legs(c, fish, nm, shadow) {
    var COL = fish.col;
    c.save(); c.lineCap = "round"; c.lineJoin = "round";
    [7, 17].forEach(function (ii, li) {
      var m = mk(fish, ii / (N - 1));
      if (m < 0.02) return;
      [1, -1].forEach(function (sd) {
        var sp = fish.spine[ii], n = nm[ii], w = wAt(ii / (N - 1), m) * 0.8;
        var bx = sp.x + n.nx * w * sd, by = sp.y + n.ny * w * sd;
        var step = Math.sin(ft * 3.2 + li * Math.PI + (sd > 0 ? 0 : Math.PI)) * 0.35;
        var a1 = n.ang + sd * 1.25 - sd * step, a2 = a1 - sd * 1.3;
        var kx = bx + Math.cos(a1) * 18 * m, ky = by + Math.sin(a1) * 18 * m;
        var fx = kx + Math.cos(a2) * 13 * m, fy = ky + Math.sin(a2) * 13 * m;
        c.strokeStyle = shadow ? "#000" : COL.body0; c.lineWidth = 6.5 * m;
        c.beginPath(); c.moveTo(bx, by); c.lineTo(kx, ky); c.lineTo(fx, fy); c.stroke();
        if (shadow) return;
        c.strokeStyle = COL.fin; c.lineWidth = 2.2 * m; c.stroke();
        c.strokeStyle = COL.eye; c.lineWidth = 1.5;
        [-0.55, 0, 0.55].forEach(function (o) {
          c.beginPath(); c.moveTo(fx, fy);
          c.lineTo(fx + Math.cos(a2 + o) * 6.5 * m, fy + Math.sin(a2 + o) * 6.5 * m); c.stroke();
        });
      });
    });
    c.restore();
  }
  function drawFish(c, fish, shadow) {
    var spine = fish.spine, COL = fish.col;
    ft = t + fish.ph;
    function mi(i) { return mk(fish, i / (N - 1)); }
    var m = fish.m;
    var nm = normals(fish), i, j, flap = Math.sin(ft * 1.4) * 0.18, rays = !shadow && COL.ray;
    var ip = 5, iv = 14, pn = nm[ip], vn = nm[iv], pw = wAt(ip / (N - 1), mi(ip)) * 0.8, vw = wAt(iv / (N - 1), mi(iv)) * 0.8;
    var kp = 1 - mi(ip), kv = 1 - mi(iv), kt = 1 - mi(N - 1);
    var tailAng = nm[N - 1].ang + Math.sin(ft * 2 - 0.6) * 0.18;
    c.fillStyle = shadow ? "#000" : COL.fin;
    /* koi fins (each shrinks away as the light reaches it) sit under the body */
    if (kp > 0.02) {
      finShape(c, spine[ip].x + pn.nx * pw, spine[ip].y + pn.ny * pw, pn.ang + 1.1 + flap, 30 * kp, 28 * kp, rays);
      finShape(c, spine[ip].x - pn.nx * pw, spine[ip].y - pn.ny * pw, pn.ang - 1.1 - flap, 30 * kp, 28 * kp, rays);
    }
    if (kv > 0.02) {
      finShape(c, spine[iv].x + vn.nx * vw, spine[iv].y + vn.ny * vw, vn.ang + 0.8 - flap, 15 * kv, 12 * kv, rays);
      finShape(c, spine[iv].x - vn.nx * vw, spine[iv].y - vn.ny * vw, vn.ang - 0.8 + flap, 15 * kv, 12 * kv, rays);
    }
    if (kt > 0.02) tailShape(c, spine[N - 1].x, spine[N - 1].y, tailAng, rays, kt);
    /* dragon underlayers grow in where the light has passed: tail plume, mane, legs */
    var mt = 1 - kt;
    if (mt > 0.02) {
      var tl = spine[N - 1];
      for (j = 0; j < 5; j++) {
        var o = j / 4 - 0.5;
        leaf(c, tl.x, tl.y, tailAng + o * 1.3 + Math.sin(ft * 2.2 + j) * 0.1, 48 * mt * (1 - Math.abs(o) * 0.6), 13 * mt, Math.sin(ft * 2.4 + j) * 7 * mt);
      }
    }
    for (j = 0; j < 3; j++) {
      var mm = mi(3 + j);
      if (mm < 0.02) continue;
      [1, -1].forEach(function (sd) {
        var ii = 3 + j, n = nm[ii], w = wAt(ii / (N - 1), mm) * 0.8;
        leaf(c, spine[ii].x + n.nx * w * sd, spine[ii].y + n.ny * w * sd,
          n.ang + sd * (0.75 + 0.2 * j) + Math.sin(ft * 3 + j) * 0.12 * sd, (25 - j * 4) * mm, 9 * mm, Math.sin(ft * 2 + j) * 3 * mm * sd);
      });
    }
    legs(c, fish, nm, shadow);
    if (shadow) { bodyPath(c, spine, nm, 1, fish); c.fillStyle = "#000"; c.fill(); return; }
    /* body */
    var g = c.createLinearGradient(spine[0].x, spine[0].y, spine[N - 1].x, spine[N - 1].y);
    g.addColorStop(0, COL.body0); g.addColorStop(1, COL.body1);
    c.save();
    bodyPath(c, spine, nm, 1, fish); c.fillStyle = g; c.fill(); c.clip();
    c.fillStyle = COL.patch;
    PATCH.forEach(function (p) {
      var pm = mi(p[0]), pr = 1 - 0.15 * pm;
      var sp = spine[p[0]], n = nm[p[0]], off = p[1] * fish.flip * wAt(p[0] / (N - 1), pm);
      c.beginPath(); c.ellipse(sp.x + n.nx * off, sp.y + n.ny * off, p[2] * 1.25 * pr, p[2] * pr, n.ang, 0, 6.283); c.fill();
    });
    /* volume: dark rim on the flanks, soft light along the back */
    bodyPath(c, spine, nm, 1, fish); c.strokeStyle = COL.rim; c.lineWidth = 7; c.stroke();
    bodyPath(c, spine, nm, 0.4, fish); c.fillStyle = "rgba(255,255,255,.07)"; c.fill();
    /* the transforming light: a bright band across the body at the sweep front */
    if (fish.t0 !== null) {
      var fk = frontK(fish), fp = spineAt(fish, fk), fn = nm[fp.i], env = Math.min(1, fish.burst * 2.2);
      var fw = wAt(fk, mk(fish, fk)) + 6;
      c.globalCompositeOperation = "lighter";
      var lg = c.createLinearGradient(fp.x - Math.cos(fn.ang) * 16, fp.y - Math.sin(fn.ang) * 16, fp.x + Math.cos(fn.ang) * 16, fp.y + Math.sin(fn.ang) * 16);
      lg.addColorStop(0, "rgba(230,255,190,0)");
      lg.addColorStop(0.5, "rgba(240,255,210," + (0.95 * env).toFixed(3) + ")");
      lg.addColorStop(1, "rgba(230,255,190,0)");
      c.fillStyle = lg;
      c.beginPath();
      c.moveTo(fp.x + fn.nx * fw - Math.cos(fn.ang) * 16, fp.y + fn.ny * fw - Math.sin(fn.ang) * 16);
      c.lineTo(fp.x + fn.nx * fw + Math.cos(fn.ang) * 16, fp.y + fn.ny * fw + Math.sin(fn.ang) * 16);
      c.lineTo(fp.x - fn.nx * fw + Math.cos(fn.ang) * 16, fp.y - fn.ny * fw + Math.sin(fn.ang) * 16);
      c.lineTo(fp.x - fn.nx * fw - Math.cos(fn.ang) * 16, fp.y - fn.ny * fw - Math.sin(fn.ang) * 16);
      c.closePath(); c.fill();
      c.globalCompositeOperation = "source-over";
    }
    c.restore();
    /* halo around the light band, spilling past the body */
    if (fish.t0 !== null) {
      var hk = frontK(fish), hp = spineAt(fish, hk), henv = Math.min(1, fish.burst * 2.2);
      c.save(); c.globalCompositeOperation = "lighter";
      var hg = c.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 42);
      hg.addColorStop(0, "rgba(220,255,170," + (0.55 * henv).toFixed(3) + ")");
      hg.addColorStop(1, "rgba(122,204,64,0)");
      c.fillStyle = hg; c.beginPath(); c.arc(hp.x, hp.y, 42, 0, 6.283); c.fill();
      c.restore();
    }
    /* dorsal fin seen from above: a thin ridge down the back */
    c.beginPath(); c.moveTo(spine[8].x, spine[8].y);
    for (i = 9; i <= 18; i++) c.lineTo(spine[i].x, spine[i].y);
    c.lineCap = "round"; c.strokeStyle = COL.dorsal; c.lineWidth = 3; c.stroke();
    c.strokeStyle = COL.dorsalHi; c.lineWidth = 1; c.stroke();
    {
      /* dorsal spines: a row of lime chevrons down the back */
      c.fillStyle = COL.patch;
      for (i = 5; i <= 24; i += 2) {
        var sz = mi(i) * (1 - i / 34);
        if (sz < 0.02) continue;
        var ds = spine[i], dn = nm[i], L = 11 * sz, B = 4.5 * sz;
        c.beginPath();
        c.moveTo(ds.x + dn.nx * B, ds.y + dn.ny * B);
        c.lineTo(ds.x + Math.cos(dn.ang) * L, ds.y + Math.sin(dn.ang) * L);
        c.lineTo(ds.x - dn.nx * B, ds.y - dn.ny * B);
        c.closePath(); c.fill();
      }
      /* antlers sweeping back from behind the eyes, each with one tine */
      var m2 = mi(2), hs = spine[2], hn2 = nm[2], hw = wAt(2 / (N - 1), m2) * 0.55;
      c.strokeStyle = COL.eye; c.lineCap = "round";
      if (m2 > 0.02) [1, -1].forEach(function (sd) {
        var bx = hs.x + hn2.nx * hw * sd, by = hs.y + hn2.ny * hw * sd, da = hn2.ang + sd * 0.4, len = 30 * m2;
        var ex = bx + Math.cos(da) * len, ey = by + Math.sin(da) * len;
        var cx = bx + Math.cos(da + sd * 0.5) * len * 0.6, cy = by + Math.sin(da + sd * 0.5) * len * 0.6;
        c.lineWidth = 3.4;
        c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(cx, cy, ex, ey); c.stroke();
        var mx2 = (bx + 2 * cx + ex) / 4, my2 = (by + 2 * cy + ey) / 4;
        c.lineWidth = 2.4;
        c.beginPath(); c.moveTo(mx2, my2); c.lineTo(mx2 + Math.cos(da + sd * 0.95) * 10 * m2, my2 + Math.sin(da + sd * 0.95) * 10 * m2); c.stroke();
      });
    }
    /* barbels */
    var h0 = spine[0], hn = nm[1], fwd = hn.ang + Math.PI, fx = Math.cos(fwd), fy = Math.sin(fwd);
    var m0 = mi(0), k0 = 1 - m0;
    c.strokeStyle = COL.barbel; c.lineWidth = 1.2;
    if (k0 > 0.02) {
      c.save(); c.globalAlpha = k0;
      [1, -1].forEach(function (sd) {
        var bx = h0.x + hn.nx * 4 * sd - fx, by = h0.y + hn.ny * 4 * sd - fy, wig = Math.sin(ft * 2.5 + sd) * 1.5;
        c.beginPath(); c.moveTo(bx, by);
        c.quadraticCurveTo(bx + fx * 5 + hn.nx * 4 * sd, by + fy * 5 + hn.ny * 4 * sd, bx + fx * 8 + hn.nx * (7 + wig) * sd, by + fy * 8 + hn.ny * (7 + wig) * sd);
        c.stroke();
      });
      c.restore();
    }
    /* dragon whiskers: long, flowing back past the head */
    if (m0 > 0.02) {
      c.lineWidth = 1.8; c.lineCap = "round";
      [1, -1].forEach(function (sd) {
        var bx = h0.x + hn.nx * 5 * sd + fx * 3, by = h0.y + hn.ny * 5 * sd + fy * 3;
        var w1 = Math.sin(ft * 2.6 + sd) * 8, w2 = Math.sin(ft * 2.6 + sd - 1.4) * 11;
        c.beginPath(); c.moveTo(bx, by);
        c.bezierCurveTo(bx + fx * 11 * m0 + hn.nx * 17 * m0 * sd, by + fy * 11 * m0 + hn.ny * 17 * m0 * sd,
          bx - fx * 20 * m0 + hn.nx * (31 * m0 + w1) * sd, by - fy * 20 * m0 + hn.ny * (31 * m0 + w1) * sd,
          bx - fx * 56 * m0 + hn.nx * (20 * m0 + w2) * sd, by - fy * 56 * m0 + hn.ny * (20 * m0 + w2) * sd);
        c.stroke();
      });
    }
    /* eyes on the sides of the head */
    var e = spine[2], ew = wAt(2 / (N - 1), mi(2)) * 0.78;
    [1, -1].forEach(function (sd) {
      c.beginPath(); c.arc(e.x + nm[2].nx * ew * sd, e.y + nm[2].ny * ew * sd, 2.6, 0, 6.283);
      c.fillStyle = COL.eye; c.fill();
      c.beginPath(); c.arc(e.x + nm[2].nx * ew * sd, e.y + nm[2].ny * ew * sd, 1.6, 0, 6.283);
      c.fillStyle = COL.pupil; c.fill();
    });
  }
  /* draws one fish scaled around its head, optionally nudged (shadow offset) */
  function place(c, fish, shadow) {
    var h = fish.spine[0];
    c.save();
    c.translate(h.x, h.y); c.scale(fish.scale, fish.scale);
    c.translate(-h.x + (shadow ? SHADOW.x : 0), -h.y + (shadow ? SHADOW.y : 0));
    drawFish(c, fish, shadow); c.restore();
  }
  function draw() {
    var fish = mate ? [mate, koi] : [koi];
    ctx.clearRect(0, 0, W, H);
    /* drop shadow: opaque silhouettes offscreen, blurred and faded onto the floor */
    octx.setTransform(dpr, 0, 0, dpr, 0, 0); octx.clearRect(0, 0, W, H);
    fish.forEach(function (f) { place(octx, f, true); });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 0.38; ctx.filter = "blur(" + Math.round(4 * dpr) + "px)";
    ctx.drawImage(off, 0, 0); ctx.restore();
    fish.forEach(function (f) { place(ctx, f, false); });
  }
  if (window.I18N) window.I18N.onChange(function () { tipKey = ""; if (tipOn) renderTip(); });
  requestAnimationFrame(frame);
}
