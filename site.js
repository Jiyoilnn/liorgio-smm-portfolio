
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  /* header border on scroll */
  const head = $('#site-head');
  const onScroll = () => head.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const btn = $('#menu-btn'), menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  btn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });
  matchMedia('(min-width: 921px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  try {
  /* showcase filter */
  const chips = $$('.chip[data-filter]');
  const items = $$('#wall .item');
  const count = $('#wall-count');
  const names = { all: 'all', reels: 'Reels', tiktok: 'TikTok', graphics: 'Graphics', community: 'Community' };
  const applyFilter = (f) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === f)));
    let n = 0;
    items.forEach((it) => { const show = f === 'all' || it.dataset.cat === f; it.hidden = !show; if (show) n++; });
    count.textContent = f === 'all' ? `Showing all ${n} pieces.` : `Showing ${n} ${names[f]} pieces.`;
  };
  chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  $$('[data-filter-jump]').forEach((a) => a.addEventListener('click', () => applyFilter(a.dataset.filterJump)));

  { const f = new URLSearchParams(location.search).get('f'); if (f && names[f]) applyFilter(f); }

  } catch (e) {}

  try {
  /* hero: Liorgio himself, a looping cut-out video (colour on top, matte below) drawn with WebGL */
  (() => {
    const box = $('#stage-me'), cv = $('#me');
    if (!box || !cv || matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.connection && navigator.connection.saveData)) return;
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}'));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, 'precision mediump float;uniform sampler2D t;varying vec2 v;void main(){float y=clamp(v.y*.5,.001,.499);vec3 c=texture2D(t,vec2(v.x,y)).rgb;float a=texture2D(t,vec2(v.x,y+.5)).g;a=smoothstep(.3,.98,a);gl_FragColor=vec4(c*a,a);}'));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.src = 'img/me-loop.mp4';
    let live = false, seen = true;
    const draw = () => {
      if (v.readyState < 2) return;
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v); } catch (e) { return; }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!live) { live = true; box.classList.add('is-live'); }
    };
    const loop = () => { draw(); if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(loop); else requestAnimationFrame(loop); };
    const go = () => { if (seen && !document.hidden) v.play().catch(() => {}); else v.pause(); };
    v.addEventListener('loadeddata', () => { loop(); go(); }, { once: true });
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; go(); }).observe(box);
    document.addEventListener('visibilitychange', go);
    cv.addEventListener('webglcontextlost', () => box.classList.remove('is-live'));
  })();

  } catch (e) {}

  try {
  /* graphic design library: row-first masonry, pillar filter, show more */
  const gdWall = $('#gd-wall');
  if (gdWall) {
    const gdClip = $('#gd-clip'), gdMore = $('#gd-more'), gdBtn = $('#gd-toggle'), gdLabel = $('#gd-toggle span'), gdCount = $('#gd-count');
    const gdItems = $$('.gd-item', gdWall);
    const gdChips = $$('.chip[data-gd]');
    const gdNames = { product: 'product', engagement: 'engagement', local: 'local and seasonal', styles: 'styles and trends' };
    let gdF = 'all', gdOpen = false, gdCols = 0, gdShown = gdItems.length;
    const gdColsFor = () => (innerWidth <= 600 ? 2 : innerWidth <= 980 ? 3 : 4);
    const gdLayout = () => {
      gdCols = gdColsFor();
      const cols = Array.from({ length: gdCols }, () => { const d = document.createElement('div'); d.className = 'gd-col'; return d; });
      const h = new Array(gdCols).fill(0);
      gdShown = 0;
      gdItems.forEach((it) => {
        const on = gdF === 'all' || it.dataset.pillar === gdF;
        it.hidden = !on;
        if (!on) { cols[0].append(it); return; }
        gdShown++;
        let k = 0;
        for (let j = 1; j < gdCols; j++) if (h[j] < h[k] - 0.02) k = j;
        cols[k].append(it);
        const im = it.querySelector('img');
        h[k] += im.getAttribute('height') / im.getAttribute('width') + 0.06;
      });
      gdWall.replaceChildren(...cols);
      gdWall.classList.add('js');
    };
    const gdSync = () => {
      const cap = parseFloat(getComputedStyle(gdClip).getPropertyValue('--gd-cap')) || 1180;
      const tall = gdWall.scrollHeight > cap + 60;
      gdClip.classList.toggle('is-collapsed', tall && !gdOpen);
      gdMore.hidden = !tall;
      gdBtn.setAttribute('aria-expanded', String(gdOpen));
      gdLabel.textContent = gdOpen ? 'Show fewer' : `Show all ${gdShown} designs`;
      gdCount.textContent = gdF === 'all' ? `${gdShown} picks from a library of 200+ designs.` : `Showing ${gdShown} ${gdNames[gdF]} designs.`;
    };
    const gdApply = (f) => {
      gdF = f;
      gdChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.gd === f)));
      gdLayout();
      gdSync();
    };
    gdChips.forEach((c) => c.addEventListener('click', () => gdApply(c.dataset.gd)));
    gdBtn.addEventListener('click', () => {
      gdOpen = !gdOpen;
      gdSync();
      if (!gdOpen) $('#design').scrollIntoView({ block: 'start' });
    });
    /* keyboard users tabbing past the fold get the whole library */
    gdWall.addEventListener('focusin', (e) => {
      if (!gdClip.classList.contains('is-collapsed')) return;
      if (e.target.getBoundingClientRect().bottom > gdClip.getBoundingClientRect().bottom - 8) { gdOpen = true; gdSync(); }
    });
    let gdRaf = 0;
    addEventListener('resize', () => {
      cancelAnimationFrame(gdRaf);
      gdRaf = requestAnimationFrame(() => { if (gdColsFor() !== gdCols) gdLayout(); gdSync(); });
    });
    gdApply('all');
  }

  } catch (e) {}

  try {
  /* lightbox */
  const lb = $('#lb'), lbImg = $('#lb-img'), lbVid = $('#lb-vid'), lbCap = $('#lb-cap'), lbCount = $('#lb-count');
  const prev = $('#lb-prev'), next = $('#lb-next');
  let group = [], idx = 0, opener = null;
  const visible = (el) => !el.closest('[hidden]') || el.matches('span[hidden][data-full]');
  const show = (i) => {
    idx = (i + group.length) % group.length;
    const el = group[idx];
    const vsrc = el.dataset.video;
    lbVid.pause();
    lbVid.hidden = !vsrc; lbImg.hidden = !!vsrc;
    if (vsrc) { lbVid.poster = el.dataset.full; if (lbVid.getAttribute('src') !== vsrc) lbVid.src = vsrc; lbVid.currentTime = 0; lbVid.play().catch(() => {}); }
    lbImg.src = vsrc ? 'data:,' : el.dataset.full;
    lbImg.alt = el.dataset.cap || '';
    lbCap.textContent = el.dataset.cap || '';
    lbCount.textContent = group.length > 1 ? `${idx + 1} / ${group.length}` : '';
    prev.disabled = next.disabled = group.length < 2;
    /* warm the neighbours so arrows and swipes feel instant */
    if (group.length > 1) [idx + 1, idx - 1].forEach((j) => { const n = group[(j + group.length) % group.length]; if (n) { const im = new Image(); im.src = n.dataset.full; } });
  };
  const open = (el, trigger) => {
    const g = el.dataset.group;
    group = g ? $$(`[data-full][data-group="${g}"]`).filter(visible) : [el];
    if (group.length > 1 && group.every((x) => x.dataset.i)) group.sort((a, b) => a.dataset.i - b.dataset.i);
    const seenSrc = new Set();
    group = group.filter((x) => { const k = x.dataset.full + '|' + x.dataset.cap; if (seenSrc.has(k)) return false; seenSrc.add(k); return true; });
    const start = Math.max(0, group.findIndex((x) => x.dataset.full === el.dataset.full && x.dataset.cap === el.dataset.cap));
    opener = trigger || el;
    show(start);
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    $('#lb-close').focus();
  };
  document.addEventListener('click', (e) => {
    const z = e.target.closest('.zoom[data-full]');
    if (z) { e.preventDefault(); open(z); return; }
    const o = e.target.closest('[data-open]');
    if (o) {
      const first = $(`span[data-full="${o.dataset.open}"][data-group="${o.dataset.group}"]`);
      if (first) open(first, o);
    }
  });
  const close = () => { if (lb.open) lb.close(); };
  $('#lb-close').addEventListener('click', close);
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
  });
  lb.addEventListener('close', () => { lbVid.pause(); lbImg.src = 'data:,'; if (opener) opener.focus(); });
  /* swipe between images on touch screens */
  let tx = 0, ty = 0;
  lb.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; tx = t.clientX; ty = t.clientY; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (group.length < 2) return;
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });

  } catch (e) {}

  try {
  /* copy email */
  const copyBtn = $('#copy-email'), status = $('#copy-status'), email = $('#email');
  copyBtn.addEventListener('click', () => {
    const done = (ok) => {
      if (ok) { status.textContent = 'Copied ilananliorgio@gmail.com'; }
      else {
        const r = document.createRange(); r.selectNodeContents(email);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        status.textContent = 'Address selected. Press Ctrl+C or ⌘C to copy.';
      }
      setTimeout(() => { status.textContent = ''; }, 4000);
    };
    try { navigator.clipboard.writeText(email.textContent.trim()).then(() => done(true), () => done(false)); }
    catch (err) { done(false); }
  });

  } catch (e) {}

  /* v2: hero video sound toggle; hub tiles tilt toward the pointer */
  try {
    const fine2 = matchMedia('(hover: hover) and (pointer: fine)');
    const vid = $('#hero-vid'), snd = $('#hero-sound');
    if (vid && snd) {
      const label = snd.querySelector('span');
      if (reduce.matches) { vid.removeAttribute('autoplay'); vid.pause(); }
      snd.addEventListener('click', () => {
        const on = vid.muted || vid.paused;
        vid.muted = !on;
        if (on) { vid.currentTime = 0; vid.play().catch(() => {}); }
        snd.setAttribute('aria-pressed', String(on));
        label.textContent = on ? 'Sound on' : 'Hear me say hi';
      });
      new IntersectionObserver(([e]) => { if (!e.isIntersecting && !vid.muted) { vid.muted = true; snd.setAttribute('aria-pressed', 'false'); label.textContent = 'Hear me say hi'; } }).observe(vid);
    }
    if (!reduce.matches) $$('.tile').forEach((t) => {
      t.addEventListener('pointermove', (e) => {
        if (!fine2.matches) return;
        const b = t.getBoundingClientRect();
        t.style.setProperty('--tx', ((e.clientX - b.left) / b.width - .5).toFixed(3));
        t.style.setProperty('--ty', ((e.clientY - b.top) / b.height - .5).toFixed(3));
      });
      t.addEventListener('pointerleave', () => { t.style.setProperty('--tx', 0); t.style.setProperty('--ty', 0); });
    });
  } catch (e) {}

})();