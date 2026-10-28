/* ============================================================
   KHANG PORTFOLIO — HIGH-TECH CYBER RETICLE CURSOR
   Dual-layer precision laser dot + trailing HUD targeting reticle
============================================================ */

const CyberCursor = (() => {
  'use strict';

  const CYBER_CALLS = ['[LOCK_ON]', 'EXEC_OK', 'SYNC_200', 'QUANTUM_PULSE', 'KERNEL_ACK', 'JAVA_SYS'];

  let cursorDot, cursorRing, cursorLabel, pulseContainer;
  const isPointerDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  function initElements() {
    cursorDot      = document.querySelector('.cursor-dot');
    cursorRing     = document.querySelector('.cursor-ring');
    cursorLabel    = document.querySelector('.cursor-label');
    pulseContainer = document.getElementById('cyber-pulse-container');
  }

  function trackMouse() {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // 1. Precision Dot moves instantly 1:1 with mouse
      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Trailing Reticle moves with GSAP or smooth lerp
      if (cursorRing) {
        if (typeof gsap !== 'undefined') {
          gsap.to(cursorRing, {
            x: mouseX,
            y: mouseY,
            duration: 0.12,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          cursorRing.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }
      }
    }, { passive: true });
  }

  function trackHover() {
    // Select interactive elements
    const elements = document.querySelectorAll('a, button, .btn, .skill-card, .proj-card, .filter-btn, .tab-btn, .cert-card, .hobby-tag');

    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (!cursorRing) return;
        cursorRing.classList.add('is-hovering');

        // Determine context-aware tech label
        let label = '[TARGET]';
        if (el.classList.contains('btn--primary') || el.classList.contains('btn--outline')) {
          label = '[ACTIVATE]';
        } else if (el.classList.contains('navbar__link')) {
          label = '[NAVIGATE]';
        } else if (el.classList.contains('proj-card')) {
          label = '[PROJECT]';
        } else if (el.classList.contains('skill-card')) {
          label = '[STACK]';
        } else if (el.classList.contains('tab-btn')) {
          label = '[SWITCH]';
        } else if (el.tagName === 'BUTTON') {
          label = '[SELECT]';
        } else if (el.tagName === 'A') {
          label = '[LINK]';
        }

        if (cursorLabel) cursorLabel.textContent = label;
      });

      el.addEventListener('mouseleave', () => {
        if (!cursorRing) return;
        cursorRing.classList.remove('is-hovering');
        if (cursorLabel) cursorLabel.textContent = '';
      });
    });
  }

  function spawnPulse(x, y) {
    if (!pulseContainer) return;

    // 1. Expand Cyber Shockwave Ripple
    const ripple = document.createElement('div');
    ripple.className = 'cyber-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top  = `${y}px`;
    pulseContainer.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    // 2. Floating Telemetry Tag
    const tag = document.createElement('div');
    tag.className = 'cyber-click-tag';
    const word = CYBER_CALLS[Math.floor(Math.random() * CYBER_CALLS.length)];
    tag.textContent = word;
    tag.style.left = `${x}px`;
    tag.style.top  = `${y - 12}px`;
    pulseContainer.appendChild(tag);
    setTimeout(() => tag.remove(), 700);
  }

  function trackClick() {
    document.addEventListener('click', (e) => {
      if (cursorRing) cursorRing.classList.add('is-clicking');
      if (cursorDot)  cursorDot.classList.add('is-clicking');

      setTimeout(() => {
        if (cursorRing) cursorRing.classList.remove('is-clicking');
        if (cursorDot)  cursorDot.classList.remove('is-clicking');
      }, 160);

      spawnPulse(e.clientX, e.clientY);
    });
  }

  function init() {
    if (!isPointerDevice) return;
    initElements();
    trackMouse();
    trackHover();
    trackClick();
  }

  return { init };
})();

// Backward compatibility alias for any existing caller
const JojoCursor = CyberCursor;
window.CyberCursor = CyberCursor;
window.JojoCursor  = CyberCursor;
