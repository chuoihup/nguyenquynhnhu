

document.addEventListener('DOMContentLoaded', () => {

  GamePreloader.init();

  Navbar.init();
  Tabs.init();

  ProjectSwiper.init();
  ProjectFilter.init();
  ProjectModal.init();

  ContactForm.init();

  initAOS();
  initGPABar();
  initTyped();

  CyberCursor.init();
  Tilt.init();

  initSkillHover();
});

function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    once:     true,
    duration: 650,
    easing:   'ease-out-back',
    offset:   50,
  });
}

function initTyped() {
  const el = Utils.getById('typed-role');
  if (!el || typeof Typed === 'undefined') return;

  new Typed(el, {
    strings:       window.TYPED_STRINGS || ['Developer'],
    typeSpeed:     60,
    backSpeed:     40,
    backDelay:     1800,
    loop:          true,
    smartBackspace: true,
  });
}

function initGPABar() {
  Utils.queryAll('.progress-bar__fill').forEach(bar => {
    Utils.onVisible(bar, () => {
      bar.style.width = `${parseFloat(bar.dataset.percent) || 0}%`;
    });
  });
}

function initSkillHover() {
  if (typeof gsap === 'undefined') return;

  Utils.queryAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () =>
      gsap.to(card, { y: -6, duration: 0.2, ease: 'back.out(2)', overwrite: 'auto' })
    );
    card.addEventListener('mouseleave', () =>
      gsap.to(card, { y: 0,  duration: 0.2, overwrite: 'auto' })
    );
  });
}

const GamePreloader = (() => {
  function init() {
    const preloader = document.getElementById('game-preloader');
    if (!preloader) return;
    const fill = document.getElementById('game-fill');
    const pct = document.getElementById('game-percent');
    const st = document.getElementById('game-status');

    let cur = 0;
    const start = performance.now(), minTime = 1100;
    const msgs = [
      { at: 0,  text: '[STAGE_01] NẠP GAME ASSETS & SHADERS...' },
      { at: 30, text: '[PHYSICS] KHỞI TẠO GAMEPLAY LOOP & ENGINE...' },
      { at: 65, text: '[PROFILE] KẾT NỐI HỒ SƠ QUỲNH NHƯ...' },
      { at: 92, text: '[PRESS_START] TRÒ CHƠI BẮT ĐẦU! 🎮' }
    ];

    let docLoaded = document.readyState === 'complete';
    if (!docLoaded) window.addEventListener('load', () => docLoaded = true);

    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      let tgt = Math.min((elapsed / minTime) * 100, 95);
      if (docLoaded && elapsed >= minTime) tgt = 100;

      if (cur < tgt) {
        cur += (tgt - cur) * 0.2 + 0.8;
        if (cur > tgt) cur = tgt;
      }

      if (fill) fill.style.width = cur + '%';
      if (pct) pct.textContent = Math.floor(cur) + '%';
      if (st) {
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (cur >= msgs[i].at) { st.textContent = msgs[i].text; break; }
        }
      }

      if (cur >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          preloader.classList.add('is-loaded');
          setTimeout(() => {
            if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
          }, 700);
        }, 220);
      }
    }, 20);

    setTimeout(() => {
      if (!preloader.classList.contains('is-loaded')) {
        clearInterval(timer);
        preloader.classList.add('is-loaded');
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 700);
      }
    }, 2400);
  }

  return { init };
})();
