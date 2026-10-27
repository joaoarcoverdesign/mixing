/* Shared koi animation: call initKoi(canvas, section) */
/* koi: top-down, follows the pointer with a slow, fluid swim */
function initKoi(canvas, section) {
  if (!canvas) return;
  /* no cursor to follow on touch devices / phones: hide the koi entirely */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.innerWidth < 768) { canvas.style.display = "none"; return; }
  var ctx = canvas.getContext("2d"), dpr = 1, W = 0, H = 0, visible = true;
  var off = document.createElement("canvas"), octx = off.getContext("2d");
  var N = 28, SEG = 7, spine = [], mouse = null, last = 0, t = 0;
  var head = { x: 0, y: 0, vx: 0, vy: 0, a: 0 };
  function resize() {
    var r = section.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = off.width = W * dpr; canvas.height = off.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  head.x = W * 0.55; head.y = H * 0.5;
  for (var i = 0; i < N; i++) spine.push({ x: head.x - i * SEG, y: head.y });
  window.addEventListener("resize", resize);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(section);
  window.addEventListener("mousemove", function (e) {
    var r = section.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top, at: performance.now() };
  }, { passive: true });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(section);
  }
  function width(k) { /* 0 snout .. 1 tail stalk: rounded head, widest behind the pectorals */
    if (k < 0.12) { var u = 1 - k / 0.12; return 17 * Math.sqrt(1 - u * u); }
    if (k < 0.3) return 17 + 3 * Math.sin((k - 0.12) / 0.18 * Math.PI / 2);
    if (k < 0.88) return 4.2 + 15.8 * (0.5 + 0.5 * Math.cos(Math.PI * (k - 0.3) / 0.58));
    return 4.2 - (k - 0.88) / 0.12 * 1.2;
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; t += dt;
    var tx, ty, wander = !mouse || now - mouse.at > 4000;
    if (wander) { tx = W * (0.5 + 0.32 * Math.sin(t * 0.21)); ty = H * (0.5 + 0.3 * Math.sin(t * 0.17 + 1.3)); }
    else { tx = mouse.x; ty = mouse.y; }
    var dx = tx - head.x, dy = ty - head.y, dist = Math.hypot(dx, dy) || 1;
    var maxSp = wander ? 50 : 130, sp = maxSp * Math.min(1, Math.max(0, (dist - 50) / 260));
    if (!wander && dist < 50) sp = 10;
    var dvx = dx / dist * sp, dvy = dy / dist * sp, k = 1 - Math.exp(-dt * 2);
    head.vx += (dvx - head.vx) * k; head.vy += (dvy - head.vy) * k;
    head.x += head.vx * dt; head.y += head.vy * dt;
    var speed = Math.hypot(head.vx, head.vy);
    if (speed > 4) {
      var ta = Math.atan2(head.vy, head.vx), da = ta - head.a;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      head.a += da * (1 - Math.exp(-dt * 3));
    }
    var amp = 0.5 + Math.min(1, speed / 60) * 0.9, freq = 1.8 + Math.min(1, speed / 90) * 1.6;
    var p0 = spine[0];
    p0.x = head.x; p0.y = head.y;
    for (var i = 1; i < N; i++) {
      var p = spine[i], q = spine[i - 1], ang = Math.atan2(p.y - q.y, p.x - q.x);
      var sway = Math.sin(t * freq - i * 0.38) * 0.022 * amp * (i / N + 0.3);
      ang += sway * (i > 1 ? 1 : 0);
      p.x = q.x + Math.cos(ang) * SEG; p.y = q.y + Math.sin(ang) * SEG;
    }
    draw();
  }
  function normals() {
    var out = [];
    for (var i = 0; i < N; i++) {
      var a = spine[Math.max(0, i - 1)], b = spine[Math.min(N - 1, i + 1)];
      var tail = Math.atan2(b.y - a.y, b.x - a.x); /* direction toward the tail */
      out.push({ nx: Math.cos(tail + Math.PI / 2), ny: Math.sin(tail + Math.PI / 2), ang: tail });
    }
    return out;
  }
  var COL = {
    body0: "rgb(38,92,32)", body1: "rgb(26,66,24)", patch: "rgba(122,204,64,.95)",
    fin: "rgba(74,146,52,.55)", ray: "rgba(170,236,120,.28)", rim: "rgba(6,22,8,.45)"
  };
  /* rounded, fan-shaped fin: base at origin, pointing along +x */
  function finShape(c, x, y, ang, len, wid, rays) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, -wid * 0.16);
    c.bezierCurveTo(len * 0.3, -wid * 0.72, len * 0.92, -wid * 0.62, len, -wid * 0.05);
    c.bezierCurveTo(len * 0.96, wid * 0.5, len * 0.4, wid * 0.62, 0, wid * 0.16);
    c.closePath(); c.fill();
    if (rays) {
      c.strokeStyle = COL.ray; c.lineWidth = 0.9;
      for (var r = -2; r <= 2; r++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(len * 0.9, r * wid * 0.2); c.stroke(); }
    }
    c.restore();
  }
  /* forked caudal fin with two flowing lobes */
  function tailShape(c, x, y, ang, rays) {
    var tl = 50, tw = 25, s1 = Math.sin(t * 2 - 1) * 6, s2 = Math.sin(t * 2 - 1.7) * 5;
    c.save(); c.translate(x, y); c.rotate(ang);
    c.beginPath(); c.moveTo(0, -3.5);
    c.bezierCurveTo(tl * 0.35, -tw * 0.35, tl * 0.7, -tw * 0.78 + s1, tl, -tw + s1 * 1.4);
    c.bezierCurveTo(tl * 0.86, -tw * 0.45 + s1, tl * 0.72, -tw * 0.12 + s2, tl * 0.62, s2);
    c.bezierCurveTo(tl * 0.72, tw * 0.12 + s2, tl * 0.86, tw * 0.45 + s1, tl, tw + s1 * 1.4);
    c.bezierCurveTo(tl * 0.7, tw * 0.78 + s1, tl * 0.35, tw * 0.35, 0, 3.5);
    c.closePath(); c.fill();
    if (rays) {
      c.strokeStyle = COL.ray; c.lineWidth = 0.9;
      for (var r = -3; r <= 3; r++) { if (!r) continue; c.beginPath(); c.moveTo(2, 0); c.lineTo(tl * 0.92, r / 3 * tw * 0.9 + (Math.abs(r) / 3) * s1); c.stroke(); }
    }
    c.restore();
  }
  function bodyPath(c, nm, f) {
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
  function drawFish(c, shadow) {
    var nm = normals(), i, flap = Math.sin(t * 1.4) * 0.18;
    var ip = 5, iv = 14, pn = nm[ip], vn = nm[iv], pw = width(ip / (N - 1)) * 0.8, vw = width(iv / (N - 1)) * 0.8;
    var tailAng = nm[N - 1].ang + Math.sin(t * 2 - 0.6) * 0.18;
    c.fillStyle = shadow ? "#000" : COL.fin;
    /* fins sit under the body */
    finShape(c, spine[ip].x + pn.nx * pw, spine[ip].y + pn.ny * pw, pn.ang + 1.1 + flap, 30, 28, !shadow);
    finShape(c, spine[ip].x - pn.nx * pw, spine[ip].y - pn.ny * pw, pn.ang - 1.1 - flap, 30, 28, !shadow);
    finShape(c, spine[iv].x + vn.nx * vw, spine[iv].y + vn.ny * vw, vn.ang + 0.8 - flap, 15, 12, !shadow);
    finShape(c, spine[iv].x - vn.nx * vw, spine[iv].y - vn.ny * vw, vn.ang - 0.8 + flap, 15, 12, !shadow);
    tailShape(c, spine[N - 1].x, spine[N - 1].y, tailAng, !shadow);
    if (shadow) { bodyPath(c, nm, 1); c.fill(); return; }
    /* body */
    var g = c.createLinearGradient(spine[0].x, spine[0].y, spine[N - 1].x, spine[N - 1].y);
    g.addColorStop(0, COL.body0); g.addColorStop(1, COL.body1);
    c.save();
    bodyPath(c, nm, 1); c.fillStyle = g; c.fill(); c.clip();
    c.fillStyle = COL.patch;
    PATCH.forEach(function (p) {
      var sp = spine[p[0]], n = nm[p[0]], off = p[1] * width(p[0] / (N - 1));
      c.beginPath(); c.ellipse(sp.x + n.nx * off, sp.y + n.ny * off, p[2] * 1.25, p[2], n.ang, 0, 6.283); c.fill();
    });
    /* volume: dark rim on the flanks, soft light along the back */
    bodyPath(c, nm, 1); c.strokeStyle = COL.rim; c.lineWidth = 7; c.stroke();
    bodyPath(c, nm, 0.4); c.fillStyle = "rgba(255,255,255,.07)"; c.fill();
    c.restore();
    /* dorsal fin seen from above: a thin ridge down the back */
    c.beginPath(); c.moveTo(spine[8].x, spine[8].y);
    for (i = 9; i <= 18; i++) c.lineTo(spine[i].x, spine[i].y);
    c.lineCap = "round"; c.strokeStyle = "rgba(10,34,12,.6)"; c.lineWidth = 3; c.stroke();
    c.strokeStyle = "rgba(170,236,120,.22)"; c.lineWidth = 1; c.stroke();
    /* barbels */
    var h0 = spine[0], hn = nm[1], fwd = hn.ang + Math.PI, fx = Math.cos(fwd), fy = Math.sin(fwd);
    c.strokeStyle = "rgba(122,204,64,.75)"; c.lineWidth = 1.2;
    [1, -1].forEach(function (sd) {
      var bx = h0.x + hn.nx * 4 * sd - fx, by = h0.y + hn.ny * 4 * sd - fy, wig = Math.sin(t * 2.5 + sd) * 1.5;
      c.beginPath(); c.moveTo(bx, by);
      c.quadraticCurveTo(bx + fx * 5 + hn.nx * 4 * sd, by + fy * 5 + hn.ny * 4 * sd, bx + fx * 8 + hn.nx * (7 + wig) * sd, by + fy * 8 + hn.ny * (7 + wig) * sd);
      c.stroke();
    });
    /* eyes on the sides of the head */
    var e = spine[2], ew = width(2 / (N - 1)) * 0.78;
    [1, -1].forEach(function (sd) {
      c.beginPath(); c.arc(e.x + nm[2].nx * ew * sd, e.y + nm[2].ny * ew * sd, 2.6, 0, 6.283);
      c.fillStyle = "rgba(190,250,130,.9)"; c.fill();
      c.beginPath(); c.arc(e.x + nm[2].nx * ew * sd, e.y + nm[2].ny * ew * sd, 1.6, 0, 6.283);
      c.fillStyle = "rgb(8,18,8)"; c.fill();
    });
  }
  var SCALE = 0.7, SHADOW = { x: 18, y: 26 };
  function draw() {
    ctx.clearRect(0, 0, W, H);
    /* drop shadow: opaque silhouette offscreen, blurred and faded onto the floor */
    octx.setTransform(dpr, 0, 0, dpr, 0, 0); octx.clearRect(0, 0, W, H);
    octx.save();
    octx.translate(spine[0].x, spine[0].y); octx.scale(SCALE, SCALE); octx.translate(-spine[0].x + SHADOW.x, -spine[0].y + SHADOW.y);
    drawFish(octx, true); octx.restore();
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 0.38; ctx.filter = "blur(" + Math.round(4 * dpr) + "px)";
    ctx.drawImage(off, 0, 0); ctx.restore();
    ctx.save();
    ctx.translate(spine[0].x, spine[0].y); ctx.scale(SCALE, SCALE); ctx.translate(-spine[0].x, -spine[0].y);
    drawFish(ctx, false); ctx.restore();
  }
  requestAnimationFrame(frame);
}
