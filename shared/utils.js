/**
 * Shared utility functions for assessment engines
 * Provides common functionality for error handling, state management, and security
 */

import { notifySuiteCompletionChanged } from './suite-completion-events.js';

/**
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
export function debounce(fn, ms) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function shouldNotifySuiteCompletion(key, data) {
  if (key !== 'progress') return true;
  return (
    data?.reportComplete === true ||
    data?.completed === true ||
    data?.currentStage === 'results'
  );
}

/**
 * Security utilities for input sanitization
 */
export const SecurityUtils = {
  /**
   * Sanitize HTML string to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} - Sanitized string
   */
  sanitizeHTML(str) {
    if (typeof str !== 'string') return str;
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Recursively sanitize objects/arrays for display
   * @param {any} obj - Object, array, or primitive to sanitize
   * @returns {any} - Sanitized version
   */
  sanitizeForDisplay(obj) {
    if (typeof obj === 'string') {
      return this.sanitizeHTML(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeForDisplay(item));
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeForDisplay(value);
      }
      return sanitized;
    }
    return obj;
  },

  /**
   * Safely set innerHTML - assumes content is already sanitized
   * Dynamic content should be sanitized BEFORE building the template literal
   * @param {HTMLElement} element - Element to set innerHTML on
   * @param {string} content - HTML content to set (should already have dynamic parts sanitized)
   */
  safeInnerHTML(element, content) {
    if (!element) {
      console.warn('SecurityUtils.safeInnerHTML: element is null or undefined');
      return;
    }
    if (typeof content !== 'string') {
      console.warn('SecurityUtils.safeInnerHTML: content is not a string', typeof content);
      element.innerHTML = '';
      return;
    }
    // Trust the HTML structure - dynamic content should already be sanitized
    // This allows HTML tags in template literals to render correctly
    element.innerHTML = content;
  },

  /**
   * Safely set innerHTML with template function (sanitizes all string values)
   * @param {HTMLElement} element - Element to set innerHTML on
   * @param {Function} templateFn - Template function that returns HTML string
   * @param {any} data - Data object to pass to template (will be sanitized)
   */
  safeTemplate(element, templateFn, data) {
    if (!element || typeof templateFn !== 'function') {
      console.warn('SecurityUtils.safeTemplate: invalid arguments');
      return;
    }
    const sanitized = this.sanitizeForDisplay(data);
    const html = templateFn(sanitized);
    element.innerHTML = this.sanitizeHTML(html);
  }
};

/**
 * DataStore abstraction for localStorage with versioning and error handling
 */
export class DataStore {
  constructor(namespace) {
    this.namespace = namespace;
    this.version = '1.0.0';
  }

  /**
   * Save data with versioning and error handling
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @returns {boolean} - Success status
   */
  save(key, data) {
    try {
      const payload = {
        version: this.version,
        timestamp: Date.now(),
        data: data
      };
      if (key === 'progress') {
        localStorage.setItem(`resume:${this.namespace}`, 'true');
      }
      localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(payload));
      if (shouldNotifySuiteCompletion(key, data)) {
        notifySuiteCompletionChanged();
      }
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      // Fallback to sessionStorage
      try {
        if (key === 'progress') {
          sessionStorage.setItem(`resume:${this.namespace}`, 'true');
        }
        sessionStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(payload));
        if (shouldNotifySuiteCompletion(key, data)) {
          notifySuiteCompletionChanged();
        }
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Load data with version checking
   * @param {string} key - Storage key
   * @returns {any|null} - Stored data or null
   */
  load(key) {
    try {
      const resumeKey = `resume:${this.namespace}`;
      const storedLocal = localStorage.getItem(`${this.namespace}:${key}`);
      const storedSession = sessionStorage.getItem(`${this.namespace}:${key}`);
      const stored = storedLocal || storedSession;
      const resumeAllowed = sessionStorage.getItem(resumeKey) === 'true'
        || localStorage.getItem(resumeKey) === 'true'
        || Boolean(storedLocal);
      if (key === 'progress' && !resumeAllowed) return null;
      if (!stored) return null;
      if (key === 'progress' && !sessionStorage.getItem(resumeKey) && !localStorage.getItem(resumeKey)) {
        localStorage.setItem(resumeKey, 'true');
      }
      
      const payload = JSON.parse(stored);
      
      // Version checking and migration
      if (payload.version !== this.version) {
        return this.migrate(payload);
      }
      
      if (key === 'progress' && resumeAllowed) {
        sessionStorage.removeItem(resumeKey);
      }
      return payload.data;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  }

  /**
   * Migrate data between versions
   * @param {Object} oldPayload - Old payload with different version
   * @returns {any} - Migrated data
   */
  migrate(oldPayload) {
    console.log(`Migrating from ${oldPayload.version} to ${this.version}`);
    // Migration logic here - for now, just return old data
    return oldPayload.data;
  }

  /**
   * Clear stored data
   * @param {string} key - Storage key
   */
  clear(key) {
    if (!key) {
      Object.keys(localStorage)
        .filter(storageKey => storageKey.startsWith(`${this.namespace}:`))
        .forEach(storageKey => localStorage.removeItem(storageKey));
      Object.keys(sessionStorage)
        .filter(storageKey => storageKey.startsWith(`${this.namespace}:`))
        .forEach(storageKey => sessionStorage.removeItem(storageKey));
      localStorage.removeItem(`resume:${this.namespace}`);
      sessionStorage.removeItem(`resume:${this.namespace}`);
      return;
    }
    localStorage.removeItem(`${this.namespace}:${key}`);
    sessionStorage.removeItem(`${this.namespace}:${key}`);
    if (key === 'progress') {
      localStorage.removeItem(`resume:${this.namespace}`);
      sessionStorage.removeItem(`resume:${this.namespace}`);
    }
  }

  /**
   * Export all data for this namespace
   * @returns {string} - JSON string of all data
   */
  export() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.namespace)) {
        data[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(data, null, 2);
  }
}

/**
 * Error handling utilities
 */
export const ErrorHandler = {
  errors: [],

  /**
   * Log error with context
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  logError(error, context = '') {
    const errorEntry = {
      timestamp: new Date(),
      message: error.message,
      stack: error.stack,
      context: context
    };
    this.errors.push(errorEntry);
    console.error(`[${context}] Assessment Error:`, error);
  },

  /**
   * Show user-friendly error message
   * @param {string} message - Error message to display
   * @param {HTMLElement} container - Container to show error in
   */
  showUserError(message, container = null) {
    // Remove any existing error
    const existing = document.querySelector('.user-error');
    if (existing) existing.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'user-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.innerHTML = `
      <span>⚠️ ${SecurityUtils.sanitizeHTML(message)}</span>
      <button onclick="this.parentElement.remove()" aria-label="Dismiss error message">×</button>
    `;
    
    const targetContainer = container || document.querySelector('.assessment-container') || document.body;
    targetContainer.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
    
    // Focus for screen readers
    errorDiv.focus();
    
    return errorDiv;
  },

  /**
   * Clear all logged errors
   */
  clearErrors() {
    this.errors = [];
  }
};

/**
 * DOM utilities for common operations
 */
export const DOMUtils = {
  /**
   * Create element with attributes and children
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Attributes object
   * @param {Array|string} children - Child elements or text
   * @returns {HTMLElement} - Created element
   */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key === 'className') {
        el.className = value;
      } else if (key.startsWith('data-')) {
        el.setAttribute(key, value);
      } else {
        el[key] = value;
      }
    }
    
    if (typeof children === 'string') {
      el.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          el.appendChild(child);
        }
      });
    }
    
    return el;
  },

  /**
   * Focus management - focus element and scroll into view
   * @param {HTMLElement} element - Element to focus
   * @param {Object} options - Focus options
   */
  focusElement(element, options = {}) {
    if (!element) return;
    
    element.focus({ preventScroll: options.preventScroll || false });
    
    if (!options.preventScroll) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }
};

