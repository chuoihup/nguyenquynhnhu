/**
 * tabs.js
 * Accessible tab component with keyboard navigation.
 * Expects: .tab-btn[aria-controls], .tab-panel[id]
 */

const Tabs = (() => {
  function init() {
    const tabBtns   = Utils.queryAll('.tab-btn');
    const tabPanels = Utils.queryAll('.tab-panel');
    if (!tabBtns.length) return;

    function activate(btn) {
      const targetId = btn.getAttribute('aria-controls');

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      // Refresh AOS animations inside the revealed panel
      if (typeof AOS !== 'undefined') AOS.refreshHard();
    }

    tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => activate(btn));

      // Arrow-key navigation (WCAG pattern)
      btn.addEventListener('keydown', (e) => {
        const count = tabBtns.length;
        let next = null;
        if (e.key === 'ArrowRight') next = tabBtns[(index + 1) % count];
        if (e.key === 'ArrowLeft')  next = tabBtns[(index - 1 + count) % count];
        if (next) { next.focus(); activate(next); }
      });
    });
  }

  return { init };
})();
