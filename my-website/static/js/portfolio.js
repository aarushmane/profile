(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const css = name => getComputedStyle(root).getPropertyValue(name).trim();

  /* ---------- Theme toggle ---------- */
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const effectiveTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  const themeButton = document.querySelector('.theme-toggle');
  const syncThemeLabel = () => themeButton?.setAttribute('aria-label', effectiveTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeButton?.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('am-theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeLabel();
    document.dispatchEvent(new CustomEvent('themechange'));
  });
  systemDark.addEventListener('change', () => { syncThemeLabel(); document.dispatchEvent(new CustomEvent('themechange')); });
  syncThemeLabel();

  /* ---------- Hero title: split into characters / words ---------- */
  if (!reducedMotion.matches) {
    document.querySelectorAll('[data-chars]').forEach(el => {
      let i = 0;
      el.innerHTML = el.textContent.trim().split(' ').map(word =>
        `<span class="w">${[...word].map(ch => `<span class="ch" style="--i:${i++}">${ch}</span>`).join('')}</span>`
      ).join(' ');
    });
    document.querySelectorAll('[data-words]').forEach(el => {
      el.innerHTML = el.textContent.trim().split(' ').map((word, i) => `<span class="wd" style="--i:${i}">${word}</span>`).join(' ');
    });
  }

  /* ---------- Hero field: planned routes, disturbances, corrections ---------- */
  const canvas = document.querySelector('.hero-field');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, lanes = [], colors = {}, running = false, visible = true, last = 0, frame = 0;
    const rand = (a, b) => a + Math.random() * (b - a);
    const readColors = () => { colors = { accent: css('--accent'), teal: css('--teal'), line: css('--line-2'), ink: css('--ink-3') }; };
    const newPass = lane => {
      lane.x = -20;
      lane.dist = rand(.18, .55) * w;
      lane.push = rand(.55, 1) * lane.amp * (Math.random() < .5 ? -1 : 1);
      lane.speed = rand(.06, .1) * w;
    };
    const build = () => {
      const count = w < 700 ? 5 : 7;
      lanes = Array.from({ length: count }, (_, i) => {
        const lane = {
          base: h * (.14 + .72 * (i / (count - 1))),
          amp: h * rand(.035, .07),
          freq: (Math.PI * 2 / w) * rand(.8, 1.6),
          phase: rand(0, Math.PI * 2),
          drift: rand(.04, .1) * (Math.random() < .5 ? -1 : 1),
          robot: i % 2 === 1
        };
        if (lane.robot) { newPass(lane); lane.x = rand(.1, .9) * w; }
        return lane;
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    const ref = (lane, x, t) => lane.base + lane.amp * Math.sin(lane.freq * x + lane.phase + t * lane.drift) + lane.amp * .35 * Math.sin(lane.freq * 2.3 * x - t * lane.drift * .7);
    const error = (lane, x) => {
      if (x < lane.dist) return 0;
      const d = x - lane.dist;
      return lane.push * Math.sin(Math.min(d / 60, Math.PI / 2)) * Math.exp(-d / 210) * Math.cos(d / 70);
    };
    const draw = t => {
      ctx.clearRect(0, 0, w, h);
      lanes.forEach(lane => {
        // planned route
        ctx.beginPath();
        for (let x = -10; x <= w + 10; x += 8) { const y = ref(lane, x, t); x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.setLineDash([3, 7]);
        ctx.strokeStyle = colors.line;
        ctx.globalAlpha = lane.robot ? .9 : .55;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        if (!lane.robot) return;
        // travelled route, with a disturbance and its corrections
        const end = Math.min(lane.x, w + 20);
        if (end <= 0) return;
        const grad = ctx.createLinearGradient(Math.max(0, end - w * .6), 0, end, 0);
        grad.addColorStop(0, colors.teal + '00');
        grad.addColorStop(.6, colors.teal);
        grad.addColorStop(1, colors.accent);
        ctx.beginPath();
        let px = 0, py = 0;
        for (let x = -10; x <= end; x += 4) { px = x; py = ref(lane, x, t) + error(lane, x); x === -10 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.strokeStyle = grad;
        ctx.globalAlpha = .85;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        // disturbance marker
        if (end > lane.dist) {
          const dy = ref(lane, lane.dist, t);
          ctx.globalAlpha = .55;
          ctx.strokeStyle = colors.accent;
          ctx.beginPath(); ctx.moveTo(lane.dist, dy - 9); ctx.lineTo(lane.dist, dy + 9); ctx.stroke();
        }
        // robot
        ctx.globalAlpha = .18;
        ctx.fillStyle = colors.accent;
        ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
    const tick = now => {
      frame = 0;
      if (!running) return;
      const dt = Math.min(.05, (now - (last || now)) / 1000);
      last = now;
      lanes.forEach(lane => { if (lane.robot) { lane.x += lane.speed * dt; if (lane.x > w + 40) newPass(lane); } });
      draw(now / 1000);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      const should = visible && !document.hidden && !reducedMotion.matches;
      if (should && !running) { running = true; last = 0; frame = requestAnimationFrame(tick); }
      if (!should) { running = false; if (frame) cancelAnimationFrame(frame); frame = 0; if (reducedMotion.matches) draw(0); }
    };
    readColors(); resize(); draw(0);
    requestAnimationFrame(() => canvas.classList.add('is-ready'));
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); draw(performance.now() / 1000); }, 120); });
    document.addEventListener('themechange', () => { readColors(); draw(performance.now() / 1000); });
    document.addEventListener('visibilitychange', sync);
    reducedMotion.addEventListener('change', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(e => { visible = e[0].isIntersecting; sync(); }).observe(canvas);
    sync();
  }

  /* ---------- Trajectory study ---------- */
  const study = document.querySelector('.trajectory-study');
  if (study) {
    const plot = study.querySelector('svg');
    const path = study.querySelector('.motion-path');
    const motion = study.querySelector('animateMotion');
    const caption = study.querySelector('.study-caption');
    const status = study.querySelector('.study-status');
    const pause = study.querySelector('.motion-toggle');
    const modes = {
      plan: ['M45 234C112 234 92 80 193 80S301 221 396 57', '1. Choose a route', 'Follow the robot from start to goal. Try adding a push, then correcting it.'],
      drift: ['M45 234C122 250 110 139 202 114S306 213 404 105', '2. Add a disturbance', 'A push sends the robot away from its planned route. Without correction, it misses the goal.'],
      track: ['M45 234C90 248 106 102 153 94S187 67 211 87S262 160 295 145S354 128 396 57', '3. Correct the course', 'Sensors reveal the error. Small steering corrections bring the robot back to its goal.']
    };
    study.querySelectorAll('[data-trajectory]').forEach(button => {
      button.addEventListener('click', () => {
        const [d, label, text] = modes[button.dataset.trajectory];
        study.querySelectorAll('[data-trajectory]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        path.setAttribute('d', d);
        motion.setAttribute('path', d);
        path.style.animation = 'none'; void path.getBoundingClientRect(); path.style.animation = '';
        caption.textContent = text;
        status.textContent = label;
      });
    });
    let manuallyPaused = false;
    const syncMotion = () => {
      const stopped = manuallyPaused || reducedMotion.matches || document.hidden;
      if (stopped) plot.pauseAnimations(); else plot.unpauseAnimations();
      pause.setAttribute('aria-pressed', String(manuallyPaused || reducedMotion.matches));
      pause.setAttribute('aria-label', stopped ? 'Play trajectory animation' : 'Pause trajectory animation');
      pause.textContent = stopped ? '▷' : 'Ⅱ';
      study.classList.toggle('motion-paused', stopped);
    };
    pause.addEventListener('click', () => { if (reducedMotion.matches) return; manuallyPaused = !manuallyPaused; syncMotion(); });
    const motionPreference = () => { pause.disabled = reducedMotion.matches; syncMotion(); };
    motionPreference();
    reducedMotion.addEventListener('change', motionPreference);
    document.addEventListener('visibilitychange', syncMotion);
  }

  /* ---------- Navigation state + reading progress ---------- */
  const navigation = document.querySelector('.site-nav');
  const progress = document.querySelector('.reading-progress');
  let scrollFrame = 0;
  const onScroll = () => {
    scrollFrame = 0;
    navigation?.classList.toggle('nav-scrolled', window.scrollY > 24);
    const distance = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
  };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(onScroll); }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Scroll reveals, dividers, active nav link ---------- */
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); reveal.unobserve(entry.target); }
    }), { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

    const near = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-near'); near.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.sec').forEach(el => near.observe(el));

    const links = new Map([...document.querySelectorAll('.nav-links a')].map(a => [a.hash, a]));
    const current = new IntersectionObserver(entries => entries.forEach(entry => {
      const link = links.get('#' + entry.target.id);
      if (link) link.classList.toggle('is-current', entry.isIntersecting);
    }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.sec[id]').forEach(el => current.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.sec').forEach(el => el.classList.add('is-near'));
  }
})();
