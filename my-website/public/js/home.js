document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const name = document.querySelector('.typed-title');
  if (name) {
    const fullName = name.textContent;
    name.parentElement.setAttribute('aria-label', fullName);
    name.setAttribute('aria-hidden', 'true');
    name.classList.add('is-typing');
    name.textContent = '';
    let position = 0;
    const timer = window.setInterval(() => {
      name.textContent = fullName.slice(0, ++position);
      if (position >= fullName.length) {
        window.clearInterval(timer);
        window.setTimeout(() => name.classList.remove('is-typing'), 900);
      }
    }, 140);
  }

  if (!('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.profile-section, .section-heading, .info-card, .project-tile, .research-card, .civic-feature-card, .recognition-item, .contact-panel, .case-study-meta, .case-study-prose, .case-study-aside');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  items.forEach(item => {
    item.classList.add('scroll-reveal');
    observer.observe(item);
  });
});
