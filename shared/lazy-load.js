/**
 * Lazy loading utility for images
 * Implements Intersection Observer API for efficient image loading
 */

/**
 * Initialize lazy loading for all images with data-src attribute
 */
export function initLazyLoading() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    return;
  }

  // Create Intersection Observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          
          // Remove data-src to prevent reloading
          img.removeAttribute('data-src');
          
          // Add alt text if missing
          if (!img.alt && img.dataset.alt) {
            img.alt = img.dataset.alt;
          }
        }
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    // Start loading when image is 50px away from viewport
    rootMargin: '50px',
    threshold: 0.01
  });

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    // Set placeholder if not already set
    if (!img.src) {
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
    }
    imageObserver.observe(img);
  });
}

/**
 * Initialize lazy loading when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}

