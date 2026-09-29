(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stylized traces and solder pads form a subtle circuit-board layer.
  const svgNS = 'http://www.w3.org/2000/svg';
  const board = document.createElementNS(svgNS, 'svg');
  board.setAttribute('class', 'pcb-backplane'); board.setAttribute('viewBox', '0 0 1440 1000');
  board.setAttribute('preserveAspectRatio', 'none'); board.setAttribute('aria-hidden', 'true');
  const routes = [
    ['M0 130 H150 Q180 130 180 160 V270 Q180 300 210 300 H330', ''],
    ['M1440 90 H1280 Q1240 90 1240 130 V205 Q1240 240 1210 240 H1100', 'copper'],
    ['M0 540 H115 Q150 540 150 575 V690 Q150 720 190 720 H275', 'copper'],
    ['M1440 460 H1310 Q1275 460 1275 495 V570 Q1275 600 1240 600 H1150', ''],
    ['M380 0 V80 Q380 115 415 115 H505 Q540 115 540 150 V210', ''],
    ['M960 1000 V900 Q960 865 925 865 H850 Q815 865 815 830 V755', 'copper'],
    ['M0 850 H230 Q265 850 265 815 V780', ''], ['M1440 780 H1320 Q1280 780 1280 740 V700', '']
  ];
  routes.forEach(([d, cls]) => { const p=document.createElementNS(svgNS,'path'); p.setAttribute('d',d); if(cls)p.setAttribute('class',cls); board.appendChild(p); });
  [[180,160],[210,300],[1240,130],[1210,240],[150,575],[190,720],[1275,495],[1240,600],[415,115],[540,150],[925,865],[815,830],[265,815],[1280,740]].forEach(([cx,cy],i)=>{
    const c=document.createElementNS(svgNS,'circle'); c.setAttribute('cx',cx); c.setAttribute('cy',cy); c.setAttribute('r',i%3===0?7:4); c.setAttribute('class',i%3===0?'pad':''); board.appendChild(c);
  });
  document.body.prepend(board);

  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    document.documentElement.classList.add('tech-cursor');
    const cursor = document.createElement('div'); cursor.className='pixel-cursor'; document.body.appendChild(cursor);
    let lastTrail=0;
    addEventListener('pointermove', e => {
      cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px';
      if (performance.now()-lastTrail > 35) {
        lastTrail=performance.now(); const px=document.createElement('i'); px.className='pixel-trail';
        px.style.left=e.clientX+'px'; px.style.top=e.clientY+'px'; document.body.appendChild(px); setTimeout(()=>px.remove(),500);
      }
    }, {passive:true});
  }

  const overlay=document.createElement('div'); overlay.className='pixel-transition'; overlay.setAttribute('aria-hidden','true'); document.body.appendChild(overlay);
  const reveal=()=>{ if(reduceMotion)return; overlay.className='pixel-transition is-in'; setTimeout(()=>overlay.className='pixel-transition',550); };
  // Initial entry and browser back/forward entries use the same pixel reveal.
  requestAnimationFrame(reveal);
  addEventListener('pageshow', e=>{ if(e.persisted) reveal(); });
  addEventListener('popstate', reveal);

  document.addEventListener('click', e=>{
    const link=e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target==='_blank' || link.hasAttribute('download')) return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin || (url.pathname===location.pathname && url.search===location.search && url.hash)) return;
    if(reduceMotion) return;
    e.preventDefault(); overlay.className='pixel-transition is-out';
    setTimeout(()=>location.assign(url.href),390);
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const items=document.querySelectorAll('main section, main article, .case-study-content, .contact-panel');
    items.forEach(el=>el.classList.add('pixel-reveal'));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      entry.target.classList.toggle('is-visible',entry.isIntersecting);
    }),{threshold:.08,rootMargin:'0px 0px -3% 0px'});
    items.forEach(el=>observer.observe(el));
  }
})();
