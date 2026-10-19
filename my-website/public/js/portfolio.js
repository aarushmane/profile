(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const opening = document.querySelector('.opening-title');
  const name = document.querySelector('.opening-name');
  const tagline = document.querySelector('.traveling-tagline');
  const intro = document.querySelector('.intro-sequence');
  if (opening && name && tagline && intro) {
    intro.classList.add('intro-travel-enabled');
    const text = tagline.querySelector('.traveling-text');
    const origin = document.querySelector('.tagline-origin');
    const target = document.querySelector('.tagline-target');
    const sentence = 'I build software for things that move.';
    let timer;
    let complete = false;
    let frame = 0;
    const positionTagline = () => {
      frame = 0;
      if (reducedMotion.matches) {
        tagline.removeAttribute('style');
        intro.classList.add('intro-ready');
        return;
      }
      const from = origin.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const destination = window.scrollY + to.top - Math.max(130, window.innerHeight * .24);
      const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, destination)));
      const mix = (a,b) => a + (b-a)*p;
      const startSize = window.innerWidth <= 620 ? 21 : 28;
      const endSize = window.innerWidth <= 620 ? 32 : Math.min(48, window.innerWidth*.037);
      Object.assign(tagline.style, {
        position: 'fixed', left: mix(from.left, to.left)+'px', top: mix(from.top, to.top)+'px',
        width: mix(from.width,to.width)+'px', fontSize: mix(startSize,endSize)+'px',
        transform: 'none'
      });
      tagline.classList.add('tagline-positioned');
      intro.classList.toggle('intro-ready', complete && p > .85);
    };
    const requestPosition = () => { if (!frame) frame = requestAnimationFrame(positionTagline); };
    const finish = () => {
      window.clearTimeout(timer);
      name.innerHTML = 'Aarush Mane<span class="opening-period">.</span>';
      text.textContent = sentence;
      complete = true;
      opening.classList.remove('is-typing', 'tagline-typing');
      opening.classList.add('title-ready');
      positionTagline();
    };
    const typeTagline = (i=0) => {
      opening.classList.remove('is-typing');
      opening.classList.add('tagline-typing');
      text.textContent = sentence.slice(0,i);
      if (i < sentence.length) timer = window.setTimeout(() => typeTagline(i+1), 42);
      else timer = window.setTimeout(finish, 200);
    };
    if (reducedMotion.matches || (window.location.hash && window.location.hash !== '#main')) finish();
    else {
      name.textContent = '';
      text.textContent = '';
      opening.classList.add('is-typing');
      const typeName = (i=0) => {
        name.textContent = 'Aarush Mane'.slice(0,i);
        if (i < 'Aarush Mane'.length) timer = window.setTimeout(() => typeName(i+1), 95);
        else timer = window.setTimeout(typeTagline, 180);
      };
      timer = window.setTimeout(typeName, 200);
    }
    window.addEventListener('scroll', requestPosition, {passive:true});
    window.addEventListener('resize', requestPosition);
    document.fonts?.ready.then(requestPosition);
    reducedMotion.addEventListener('change', finish);
    opening.querySelector('.opening-scroll').addEventListener('focus', finish);
    positionTagline();
  }
  const study = document.querySelector('.trajectory-study');
  if (study) {
    const plot = study.querySelector('svg');
    const path = study.querySelector('.motion-path');
    const motion = study.querySelector('animateMotion');
    const caption = study.querySelector('.study-caption');
    const status = study.querySelector('.study-status');
    const pause = study.querySelector('.motion-toggle');
    const modes = {
      plan: ['M45 234C112 234 92 80 193 80S301 221 396 57', '1. Choose a route', 'Follow the blue robot from start to goal. Try adding a push, then correcting it.'],
      track: ['M45 234C90 248 106 102 153 94S187 67 211 87S262 160 295 145S354 128 396 57', '3. Correct the course', 'Sensors reveal the error. Small steering corrections bring the robot back to its goal.'],
      drift: ['M45 234C122 250 110 139 202 114S306 213 404 105', '2. Add a disturbance', 'A push sends the robot away from its planned route. Without correction, it misses the goal.']
    };
    study.querySelectorAll('[data-trajectory]').forEach(button => {
      button.addEventListener('click', () => {
        const [d, label, text] = modes[button.dataset.trajectory];
        study.querySelectorAll('[data-trajectory]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        path.setAttribute('d', d);
        motion.setAttribute('path', d);
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
    pause.addEventListener('click', () => {
      if (reducedMotion.matches) return;
      manuallyPaused = !manuallyPaused;
      syncMotion();
    });
    const motionPreference = () => {
      pause.disabled = reducedMotion.matches;
      syncMotion();
    };
    motionPreference();
    reducedMotion.addEventListener('change', motionPreference);
    document.addEventListener('visibilitychange', syncMotion);
  }
  const navigation = document.querySelector('.site-nav');
  const progress = document.querySelector('.reading-progress');
  const updateProgress = () => {
    navigation?.classList.toggle('nav-scrolled', window.scrollY > 48);
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
  };
  if (progress) {
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }
  // Keep observing so a section can fade back in when revisited.
  if ('IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.section-heading, .work-entry, .research-feature, .community-feature, .education-entry, .skills-note, .recognition-item, .contact-section, .controls-feature');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('entered', entry.isIntersecting));
    }, { threshold: 0, rootMargin: '-16px 0px -20px 0px' });
    targets.forEach(el => { el.classList.add('scroll-fade'); observer.observe(el); });
  }

  // A tracking reticle follows the real cursor; native pointer affordances remain intact.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reticle = document.createElement('div');
  reticle.className = 'cursor-reticle';
  reticle.setAttribute('aria-hidden', 'true');
  document.body.appendChild(reticle);
  let cursorFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const clearCursor = () => reticle.classList.remove('visible', 'over-link', 'pressed');
  document.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') { clearCursor(); return; }
    pointerX = event.clientX;
    pointerY = event.clientY;
    reticle.classList.add('visible');
    reticle.classList.toggle('over-link', !!event.target.closest('a, button'));
    if (!cursorFrame) cursorFrame = requestAnimationFrame(() => {
      reticle.style.left = pointerX + 'px';
      reticle.style.top = pointerY + 'px';
      cursorFrame = 0;
    });
  }, { passive: true });
  document.addEventListener('pointerdown', () => reticle.classList.add('pressed'));
  document.addEventListener('pointerup', () => reticle.classList.remove('pressed'));
  document.documentElement.addEventListener('pointerleave', clearCursor);
  window.addEventListener('blur', clearCursor);
  reducedMotion.addEventListener('change', clearCursor);
  finePointer.addEventListener('change', clearCursor);
})();
