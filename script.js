(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuBtn?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }));

  const slides = [...document.querySelectorAll('[data-slide]')];
  const dotsWrap = document.querySelector('[data-dots]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  let current = 0;
  let timer;

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => go(i, true));
    dotsWrap?.appendChild(b);
    return b;
  });

  function go(index, restart = false) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    if (restart) auto();
  }
  function auto() {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 6500);
  }
  prev?.addEventListener('click', () => go(current - 1, true));
  next?.addEventListener('click', () => go(current + 1, true));
  go(0);
  auto();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      const start = performance.now();
      const duration = 950;
      const animate = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(animate);
        else el.textContent = `${target}+`;
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.project-item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  const form = document.getElementById('inquiry-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const lines = [
      'Hi Campus Buddy, I need support.',
      `Name: ${data.get('name') || '-'}`,
      `University: ${data.get('university') || '-'}`,
      `Service: ${data.get('service') || '-'}`,
      `Deadline: ${data.get('deadline') || '-'}`,
      `Requirement: ${data.get('message') || '-'}`
    ];
    const url = `https://wa.me/8801755518181?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
