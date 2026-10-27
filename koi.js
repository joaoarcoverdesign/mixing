/* Shared koi animation: call initKoi(canvas, section) */
/* koi: top-down, follows the pointer with a slow, fluid swim.
   After the visitor opens 2 case studies (counted in analytics.js, localStorage
   "koi.cases"), an orange companion joins and swims beside it. */
function initKoi(canvas, section) {
  if (!canvas) return;
  /* no cursor to follow on touch devices / phones: hide the koi entirely */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.innerWidth < 768) { canvas.style.display = "none"; return; }
  var ctx = canvas.getContext("2d"), dpr = 1, W = 0, H = 0, visible = true;
  var off = document.createElement("canvas"), octx = off.getContext("2d");
  var N = 28, SEG = 7, mouse = null, inside = false, last = 0, t = 0, ft = 0;
  function resize() {
    var r = section.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = off.width = W * dpr; canvas.height = off.height = H * dpr;
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
  function makeFish(col, scale, x, y, ph, flip) {
    var f = { col: col, scale: scale, ph: ph, flip: flip, spine: [], head: { x: x, y: y, vx: 0, vy: 0, a: 0 } };
    for (var i = 0; i < N; i++) f.spine.push({ x: x - i * SEG, y: y });
    return f;
  }
  var SCALE = 0.7, SHADOW = { x: 18, y: 26 };
  var koi = makeFish(GREEN, SCALE, W * 0.55, H * 0.5, 0, 1), mate = null;
  if (unlocked) {
    var mx = entering ? (koi.head.x < W / 2 ? -80 : W + 80) : koi.head.x - 60;
    mate = makeFish(ORANGE, 0.6, mx, koi.head.y + 50, 1.7, -1);
  }

  window.addEventListener("resize", resize);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(section);
  window.addEventListener("mousemove", function (e) {
    var r = section.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top, at: performance.now() };
    inside = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= W && mouse.y <= H;
  }, { passive: true });
  document.addEventListener("mouseleave", function () { inside = false; });
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
  function updateTip(now) {
    var hit = over(koi) ? koi : mate && over(mate) ? mate : null;
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
    var amp = 0.5 + Math.min(1, speed / 60) * 0.9, freq = 1.8 + Math.min(1, speed / 90) * 1.6, ts = t + f.ph;
    var p0 = spine[0];
    p0.x = head.x; p0.y = head.y;
    for (var i = 1; i < N; i++) {
      var p = spine[i], q = spine[i - 1], ang = Math.atan2(p.y - q.y, p.x - q.x);
      var sway = Math.sin(ts * freq - i * 0.38) * 0.022 * amp * (i / N + 0.3);
      ang += sway * (i > 1 ? 1 : 0);
      p.x = q.x + Math.cos(ang) * SEG; p.y = q.y + Math.sin(ang) * SEG;
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
    var maxSp = wander ? 50 : 130, sp = maxSp * Math.min(1, Math.max(0, (dist - 50) / 260));
    if (!wander && dist < 50) sp = 10;
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
    updateTip(now);
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
  function tailShape(c, x, y, ang, rays) {
    var tl = 50, tw = 25, s1 = Math.sin(ft * 2 - 1) * 6, s2 = Math.sin(ft * 2 - 1.7) * 5;
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
  function bodyPath(c, spine, nm, f) {
    var i, w;
    c.beginPath();
    for (i = 0; i < N; i++) { w = width(i / (N - 1)) * f; i ? c.lineTo(spine[i].x + nm[i].nx * w, spine[i].y + nm[i].ny * w) : c.moveTo(spine[i].x + nm[i].nx * w, spine[i].y + nm[i].ny * w); }
    for (i = N - 1; i >= 0; i--) { w = width(i / (N - 1)) * f; c.lineTo(spine[i].x - nm[i].nx * w, spine[i].y - nm[i].ny * w); }
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
  function drawFish(c, fish, shadow) {
    var spine = fish.spine, COL = fish.col;
    ft = t + fish.ph;
    var nm = normals(fish), i, flap = Math.sin(ft * 1.4) * 0.18, rays = !shadow && COL.ray;
    var ip = 5, iv = 14, pn = nm[ip], vn = nm[iv], pw = width(ip / (N - 1)) * 0.8, vw = width(iv / (N - 1)) * 0.8;
    var tailAng = nm[N - 1].ang + Math.sin(ft * 2 - 0.6) * 0.18;
    c.fillStyle = shadow ? "#000" : COL.fin;
    /* fins sit under the body */
    finShape(c, spine[ip].x + pn.nx * pw, spine[ip].y + pn.ny * pw, pn.ang + 1.1 + flap, 30, 28, rays);
    finShape(c, spine[ip].x - pn.nx * pw, spine[ip].y - pn.ny * pw, pn.ang - 1.1 - flap, 30, 28, rays);
    finShape(c, spine[iv].x + vn.nx * vw, spine[iv].y + vn.ny * vw, vn.ang + 0.8 - flap, 15, 12, rays);
    finShape(c, spine[iv].x - vn.nx * vw, spine[iv].y - vn.ny * vw, vn.ang - 0.8 + flap, 15, 12, rays);
    tailShape(c, spine[N - 1].x, spine[N - 1].y, tailAng, rays);
    if (shadow) { bodyPath(c, spine, nm, 1); c.fill(); return; }
    /* body */
    var g = c.createLinearGradient(spine[0].x, spine[0].y, spine[N - 1].x, spine[N - 1].y);
    g.addColorStop(0, COL.body0); g.addColorStop(1, COL.body1);
    c.save();
    bodyPath(c, spine, nm, 1); c.fillStyle = g; c.fill(); c.clip();
    c.fillStyle = COL.patch;
    PATCH.forEach(function (p) {
      var sp = spine[p[0]], n = nm[p[0]], off = p[1] * fish.flip * width(p[0] / (N - 1));
      c.beginPath(); c.ellipse(sp.x + n.nx * off, sp.y + n.ny * off, p[2] * 1.25, p[2], n.ang, 0, 6.283); c.fill();
    });
    /* volume: dark rim on the flanks, soft light along the back */
    bodyPath(c, spine, nm, 1); c.strokeStyle = COL.rim; c.lineWidth = 7; c.stroke();
    bodyPath(c, spine, nm, 0.4); c.fillStyle = "rgba(255,255,255,.07)"; c.fill();
    c.restore();
    /* dorsal fin seen from above: a thin ridge down the back */
    c.beginPath(); c.moveTo(spine[8].x, spine[8].y);
    for (i = 9; i <= 18; i++) c.lineTo(spine[i].x, spine[i].y);
    c.lineCap = "round"; c.strokeStyle = COL.dorsal; c.lineWidth = 3; c.stroke();
    c.strokeStyle = COL.dorsalHi; c.lineWidth = 1; c.stroke();
    /* barbels */
    var h0 = spine[0], hn = nm[1], fwd = hn.ang + Math.PI, fx = Math.cos(fwd), fy = Math.sin(fwd);
    c.strokeStyle = COL.barbel; c.lineWidth = 1.2;
    [1, -1].forEach(function (sd) {
      var bx = h0.x + hn.nx * 4 * sd - fx, by = h0.y + hn.ny * 4 * sd - fy, wig = Math.sin(ft * 2.5 + sd) * 1.5;
      c.beginPath(); c.moveTo(bx, by);
      c.quadraticCurveTo(bx + fx * 5 + hn.nx * 4 * sd, by + fy * 5 + hn.ny * 4 * sd, bx + fx * 8 + hn.nx * (7 + wig) * sd, by + fy * 8 + hn.ny * (7 + wig) * sd);
      c.stroke();
    });
    /* eyes on the sides of the head */
    var e = spine[2], ew = width(2 / (N - 1)) * 0.78;
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
