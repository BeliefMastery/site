/**
 * Lazy data loading utility for assessment engines
 * Loads large data files only when needed to improve initial page load
 */

/**
 * Cache for loaded data modules
 */
const dataCache = new Map();

/**
 * Load a data module dynamically
 * @param {string} modulePath - Path to the data module
 * @returns {Promise<any>} - The exported data from the module
 */
export async function loadDataModule(modulePath) {
  // Check cache first
  if (dataCache.has(modulePath)) {
    return dataCache.get(modulePath);
  }

  try {
    // Dynamic import - only loads when called
    const module = await import(modulePath);
    
    // Cache the module
    dataCache.set(modulePath, module);
    
    return module;
  } catch (error) {
    console.error(`Failed to load data module: ${modulePath}`, error);
    throw error;
  }
}

/**
 * Preload data modules in the background
 * @param {Array<string>} modulePaths - Array of module paths to preload
 */
export async function preloadDataModules(modulePaths) {
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePreload = (callback) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 100);
    }
  };

  schedulePreload(async () => {
    const loadPromises = modulePaths.map(path => 
      loadDataModule(path).catch(err => {
        console.warn(`Preload failed for ${path}:`, err);
        return null;
      })
    );
    
    await Promise.all(loadPromises);
    console.log('Data modules preloaded');
  });
}

/**
 * Load data with loading indicator
 * @param {string} modulePath - Path to the data module
 * @param {HTMLElement} container - Container to show loading state
 * @returns {Promise<any>} - The exported data from the module
 */
export async function loadDataWithIndicator(modulePath, container) {
  if (container) {
    container.classList.add('loading');
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading-message';
    loadingMsg.textContent = 'Loading assessment data...';
    loadingMsg.setAttribute('aria-live', 'polite');
    container.appendChild(loadingMsg);
  }

  try {
    const data = await loadDataModule(modulePath);
    
    if (container) {
      container.classList.remove('loading');
      const loadingMsg = container.querySelector('.loading-message');
      if (loadingMsg) loadingMsg.remove();
    }
    
    return data;
  } catch (error) {
    if (container) {
      container.classList.remove('loading');
      container.classList.add('error');
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'Failed to load assessment data. Please refresh the page.';
      errorMsg.setAttribute('role', 'alert');
      container.appendChild(errorMsg);
    }
    throw error;
  }
}

