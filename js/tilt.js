/* ============================================================
   KHANG PORTFOLIO — 3D HOLOGRAPHIC TILT & SPECULAR SHINE
============================================================ */

const Tilt = (() => {
  const MAX_TILT  = 12;
  const MAX_SHINE = 0.35;

  function applyTilt(card) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tilt-wrap';
    card.parentNode.insertBefore(wrapper, card);
    wrapper.appendChild(card);

    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.style.position = 'relative';
    card.appendChild(shine);

    function onMove(e) {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;

      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const rotateY = dx * MAX_TILT;
      const rotateX = -dy * MAX_TILT;

      const shineX    = ((dx + 1) / 2) * 100;
      const shineY    = ((dy + 1) / 2) * 100;
      const shineDist = Math.sqrt(dx * dx + dy * dy) / Math.SQRT2;

      card.style.transform  = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03,1.03,1.03)`;
      card.style.transition = 'transform 0.08s ease-out';
      card.style.zIndex     = '10';

      shine.style.background =
        `radial-gradient(circle at ${shineX}% ${shineY}%,
          rgba(0,242,254,${(shineDist * MAX_SHINE).toFixed(2)}) 0%,
          rgba(168,85,247,${(shineDist * 0.2).toFixed(2)}) 35%,
          transparent 70%)`;
    }

    function onLeave() {
      card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.transition = 'transform 0.45s cubic-bezier(0.23,1,0.32,1)';
      card.style.zIndex     = '';
      shine.style.background = 'none';
    }

    card.addEventListener('mousemove',  onMove);
    card.addEventListener('mouseleave', onLeave);

    card.addEventListener('touchstart', () => {
      card.style.transform = 'perspective(900px) scale3d(0.98,0.98,1)';
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transform = '';
    });
  }

  function init() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    Utils.queryAll('.proj-card, .skill-card, .cert-card, .goal-card').forEach(applyTilt);
  }

  return { init };
})();
