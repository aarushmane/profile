document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const items = document.querySelectorAll('.profile-section, .section-heading, .info-card, .project-tile, .research-card, .civic-feature-card, .recognition-item, .contact-panel, .case-study-meta, .case-study-prose, .case-study-aside');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  items.forEach(item => {
    item.classList.add('scroll-reveal');
    observer.observe(item);
  });
});
