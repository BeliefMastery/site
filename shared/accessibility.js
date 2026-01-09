/**
 * Shared accessibility utilities
 * Provides keyboard navigation, ARIA improvements, and mobile menu enhancements
 */

/**
 * Initialize mobile menu with enhanced accessibility
 */
export function initializeMobileMenu() {
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.hamburger, .nav-toggle');
    const nav = document.querySelector('.nav-list, #top-nav, nav ul');
    
    if (toggle && nav) {
      // Click handler
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        nav.classList.toggle('active');
        nav.classList.toggle('open');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target) && 
            (nav.classList.contains('active') || nav.classList.contains('open'))) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('active');
          nav.classList.remove('open');
        }
      });
      
      // Close menu when pressing Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && (nav.classList.contains('active') || nav.classList.contains('open'))) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('active');
          nav.classList.remove('open');
          toggle.focus(); // Return focus to toggle button
        }
      });
      
      // Close menu when a link is clicked (mobile)
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) { // Only on mobile
            toggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('active');
            nav.classList.remove('open');
          }
        });
      });
    }
  });
}

/**
 * Initialize lazy loading fallback for older browsers
 */
export function initializeLazyLoadingFallback() {
  if (!('loading' in HTMLImageElement.prototype)) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // For older browsers that don't support lazy loading, load immediately
        // but keep the attribute for browsers that do support it
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.src = entry.target.dataset.src || entry.target.src;
              observer.unobserve(entry.target);
            }
          });
        });
        
        if (img.dataset.src) {
          observer.observe(img);
        }
      });
    });
  }
}

/**
 * Add skip link functionality
 */
export function initializeSkipLink() {
  document.addEventListener('DOMContentLoaded', () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });
}

/**
 * Initialize all accessibility features
 */
export function initializeAccessibility() {
  initializeMobileMenu();
  initializeLazyLoadingFallback();
  initializeSkipLink();
}

