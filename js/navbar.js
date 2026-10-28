

const Navbar = (() => {
  
  function initDarkMode() {
    const STORAGE_KEY = 'khang-theme';
    const html        = document.documentElement;
    const btn         = Utils.getById('btn-theme');

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }

    
    applyTheme(localStorage.getItem(STORAGE_KEY) || 'dark');

    btn && btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  
  function initScrollShadow() {
    const nav = Utils.getById('navbar');
    if (!nav) return;

    window.addEventListener(
      'scroll',
      () => nav.classList.toggle('is-scrolled', window.scrollY > 20),
      { passive: true }
    );
  }

  
  function initScrollProgress() {
    const bar = Utils.getById('scroll-progress');
    if (!bar) return;

    window.addEventListener(
      'scroll',
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
      },
      { passive: true }
    );
  }

  
  function initHamburger() {
    const burger    = Utils.getById('nav-burger');
    const mobileNav = Utils.getById('nav-mobile');
    const nav       = Utils.getById('navbar');
    if (!burger || !mobileNav) return;

    function close() {
      mobileNav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }

    function toggle() {
      const isOpen = mobileNav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    }

    burger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

    
    Utils.queryAll('.navbar__link', mobileNav)
      .forEach(link => link.addEventListener('click', close));

    
    document.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target)) close();
    });
  }

  
  function initActiveLinks() {
    const sections = Utils.queryAll('section[id]');
    const links    = Utils.queryAll('.navbar__link');
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          links.forEach(link => {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(sec => observer.observe(sec));
  }

  
  function init() {
    initDarkMode();
    initScrollShadow();
    initScrollProgress();
    initHamburger();
    initActiveLinks();
  }

  return { init };
})();
