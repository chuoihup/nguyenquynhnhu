

const ProjectSwiper = (() => {
  function init() {
    if (typeof Swiper === 'undefined') return;

    new Swiper('.projects__swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate:       18,
        stretch:      0,
        depth:        130,
        modifier:     1,
        slideShadows: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay:              4500,
        pauseOnMouseEnter:  true,
        disableOnInteraction: false,
      },
      keyboard: { enabled: true },
      a11y: {
        prevSlideMessage: 'Du an truoc',
        nextSlideMessage: 'Du an tiep theo',
      },
    });
  }

  return { init };
})();

const ProjectFilter = (() => {
  function init() {
    const filterBtns = Utils.queryAll('.filter-btn');
    const slides     = Utils.queryAll('.projects__swiper .swiper-slide');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        
        slides.forEach(slide => {
          const techs = (slide.dataset.tech || '').toLowerCase();
          const match = filter === 'all' || techs.includes(filter.toLowerCase());
          slide.style.display = match ? '' : 'none';
        });
      });
    });
  }

  return { init };
})();

const ProjectModal = (() => {
  const overlay  = Utils.getById('modal-overlay');
  const closeBtn = Utils.getById('modal-close');

  
  function spawnConfetti() {
    const container = Utils.getById('modal-confetti');
    if (!container) return;
    container.innerHTML = '';

    const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#facc15', '#34d399', '#f87171'];

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = [
        `left: ${Math.random() * 100}%`,
        `background: ${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
        `width:  ${5 + Math.random() * 5}px`,
        `height: ${5 + Math.random() * 5}px`,
        `border-radius: ${Math.random() > 0.5 ? '50%' : '2px'}`,
        `animation-delay:    ${Math.random() * 0.4}s`,
        `animation-duration: ${0.8 + Math.random() * 0.6}s`,
      ].join(';');
      container.appendChild(p);
    }
  }

  
  function open(projectId) {
    if (!overlay) return;
    const data = (window.PROJECTS || {})[projectId];
    if (!data) return;

    
    const setText = (id, value) => {
      const el = Utils.getById(id);
      if (el) el.textContent = value;
    };
    setText('modal-title', data.title || '');
    setText('modal-type',  data.type  || '');
    setText('modal-desc',  data.desc  || '');

    
    const placeholder = Utils.getById('modal-img-placeholder');
    if (placeholder) {
      if (data.img) {
        placeholder.innerHTML =
          `<img src="${data.img}" alt="${data.title}"
                style="width:100%;height:100%;object-fit:cover;border-radius:inherit"
                onerror="this.parentElement.innerHTML='${data.emoji || '&#128187;'}'" />`;
      } else {
        placeholder.innerHTML = data.emoji || '&#128187;';
      }
    }

    
    const tagsEl = Utils.getById('modal-tags');
    if (tagsEl) {
      tagsEl.innerHTML = (data.tags || [])
        .map(t => `<span class="tag">${t}</span>`)
        .join('');
    }

    
    const linksEl = Utils.getById('modal-links');
    if (linksEl) {
      linksEl.innerHTML = '';
      if (data.github) {
        const a = document.createElement('a');
        a.href      = data.github;
        a.className = 'btn btn--outline';
        a.target    = '_blank';
        a.rel       = 'noopener noreferrer';
        a.textContent = 'GitHub';
        linksEl.appendChild(a);
      }
    }

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    spawnConfetti();
    closeBtn && closeBtn.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function init() {
    if (!overlay) return;

    
    Utils.queryAll('.proj-card__btn')
      .forEach(btn => btn.addEventListener('click', () => open(btn.dataset.project)));

    
    closeBtn && closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) close();
    });
  }

  return { init };
})();
