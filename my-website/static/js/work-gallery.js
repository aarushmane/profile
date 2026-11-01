(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.work-gallery').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('.work-gallery-slide')];
    if (slides.length < 2) return;
    const controls = gallery.querySelector('.work-gallery-controls');
    const pause = gallery.querySelector('[data-gallery-pause]');
    const count = gallery.querySelector('[data-gallery-count]');
    let index = 0;
    let paused = motion.matches;
    let visible = false;
    let hovering = false;
    let timer;
    const syncVideo = () => {
      const video = slides[index].querySelector('video');
      if (!video) return;
      if (visible && !document.hidden && !paused && !motion.matches) {
        video.muted = true;
        video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
      } else {
        video.pause();
      }
    };
    const schedule = () => {
      clearTimeout(timer);
      const video = slides[index].querySelector('video');
      if (!paused && !motion.matches && visible && !hovering && !document.hidden && !gallery.contains(document.activeElement) && !video) {
        timer = setTimeout(() => show(index + 1), 5500);
      }
    };
    const show = next => {
      slides[index].querySelector('video')?.pause();
      slides[index].hidden = true;
      index = (next + slides.length) % slides.length;
      slides[index].hidden = false;
      count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      syncVideo();
      schedule();
    };
    const updatePause = () => {
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.setAttribute('aria-label', paused ? 'Start automatic slides' : 'Pause automatic slides');
      syncVideo();
      schedule();
    };
    gallery.querySelector('[data-gallery-previous]').addEventListener('click', () => show(index - 1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click', () => show(index + 1));
    pause.addEventListener('click', () => { paused = !paused; updatePause(); });
    gallery.addEventListener('mouseenter', () => { hovering = true; schedule(); });
    gallery.addEventListener('mouseleave', () => { hovering = false; schedule(); });
    gallery.addEventListener('focusin', event => {
      if (event.target.closest('video')) { clearTimeout(timer); return; }
      paused = true;
      updatePause();
    });
    gallery.addEventListener('focusout', () => setTimeout(schedule, 0));
    gallery.querySelectorAll('video').forEach(video => {
      video.addEventListener('play', schedule);
      video.addEventListener('pause', schedule);
      video.addEventListener('ended', () => {
        if (!paused && !motion.matches && visible && !document.hidden) show(index + 1);
      });
      video.addEventListener('error', () => {
        if (!paused && visible) timer = setTimeout(() => show(index + 1), 5500);
      });
    });
    document.addEventListener('visibilitychange', () => { syncVideo(); schedule(); });
    motion.addEventListener('change', () => { paused = motion.matches; updatePause(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncVideo(); schedule(); }, { threshold: .2 }).observe(gallery);
    } else { visible = true; }
    controls.hidden = false;
    gallery.classList.add('is-enhanced');
    updatePause();
  });
})();
