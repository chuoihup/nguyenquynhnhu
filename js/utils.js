/**
 * utils.js
 * Shared helper functions used across all modules.
 */

const Utils = (() => {
  /**
   * Safely get a DOM element by ID.
   * @param {string} id
   * @returns {HTMLElement|null}
   */
  function getById(id) {
    return document.getElementById(id);
  }

  /**
   * Safely query all elements matching a selector.
   * @param {string} selector
   * @param {Element} [root=document]
   * @returns {NodeList}
   */
  function queryAll(selector, root = document) {
    return root.querySelectorAll(selector);
  }

  /**
   * Add multiple event listeners to one element.
   * @param {Element} el
   * @param {string[]} events
   * @param {Function} handler
   * @param {object} [options]
   */
  function onEvents(el, events, handler, options = {}) {
    if (!el) return;
    events.forEach(ev => el.addEventListener(ev, handler, options));
  }

  /**
   * Run a callback once when an element enters the viewport.
   * @param {Element} el
   * @param {Function} callback
   * @param {number} [threshold=0.3]
   */
  function onVisible(el, callback, threshold = 0.3) {
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback(entry);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
  }

  /**
   * Validate an email address format.
   * @param {string} value
   * @returns {boolean}
   */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  return { getById, queryAll, onEvents, onVisible, isValidEmail };
})();
