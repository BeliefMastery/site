/**
 * Performance monitoring utility
 * Tracks and reports performance metrics for assessment engines
 */

/**
 * Performance metrics tracker
 */
export class PerformanceMonitor {
  constructor(engineName) {
    this.engineName = engineName;
    this.metrics = {
      initTime: null,
      firstQuestionTime: null,
      questionRenderTimes: [],
      dataLoadTime: null,
      totalTime: null
    };
    this.startTime = performance.now();
  }

  /**
   * Mark initialization complete
   */
  markInit() {
    this.metrics.initTime = performance.now() - this.startTime;
    this.logMetric('Initialization', this.metrics.initTime);
  }

  /**
   * Mark first question rendered
   */
  markFirstQuestion() {
    if (!this.metrics.firstQuestionTime) {
      this.metrics.firstQuestionTime = performance.now() - this.startTime;
      this.logMetric('First Question Rendered', this.metrics.firstQuestionTime);
    }
  }

  /**
   * Track question render time
   * @param {number} renderTime - Time taken to render question in ms
   */
  trackQuestionRender(renderTime) {
    this.metrics.questionRenderTimes.push(renderTime);
    
    // Log if render time is slow (>100ms)
    if (renderTime > 100) {
      console.warn(`Slow question render: ${renderTime.toFixed(2)}ms`);
    }
  }

  /**
   * Mark data load complete
   * @param {number} loadTime - Time taken to load data in ms
   */
  markDataLoad(loadTime) {
    this.metrics.dataLoadTime = loadTime;
    this.logMetric('Data Load', loadTime);
  }

  /**
   * Mark assessment complete
   */
  markComplete() {
    this.metrics.totalTime = performance.now() - this.startTime;
    this.logMetric('Total Assessment Time', this.metrics.totalTime);
    this.reportMetrics();
  }

  /**
   * Log a performance metric
   * @param {string} label - Metric label
   * @param {number} value - Metric value in ms
   */
  logMetric(label, value) {
    if (console && console.log) {
      console.log(`[${this.engineName}] ${label}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * Report all metrics
   */
  reportMetrics() {
    const avgRenderTime = this.metrics.questionRenderTimes.length > 0
      ? this.metrics.questionRenderTimes.reduce((a, b) => a + b, 0) / this.metrics.questionRenderTimes.length
      : 0;

    const report = {
      engine: this.engineName,
      metrics: {
        ...this.metrics,
        averageQuestionRenderTime: avgRenderTime,
        totalQuestions: this.metrics.questionRenderTimes.length
      }
    };

    // Log to console
    console.log(`[${this.engineName}] Performance Report:`, report);

    // Store in localStorage for analytics (optional)
    try {
      const reports = JSON.parse(localStorage.getItem('performanceReports') || '[]');
      reports.push(report);
      // Keep only last 10 reports
      if (reports.length > 10) {
        reports.shift();
      }
      localStorage.setItem('performanceReports', JSON.stringify(reports));
    } catch (e) {
      // Ignore storage errors
    }

    return report;
  }

  /**
   * Get current performance metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      currentTime: performance.now() - this.startTime
    };
  }
}

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Promise<any>} - Result of the function
 */
export async function measureTime(fn, label = 'Operation') {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[Performance] ${label} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
}

/**
 * Check if page is loading slowly
 * @returns {boolean} True if page load is slow
 */
export function isSlowLoad() {
  if ('performance' in window && 'timing' in window.performance) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    return loadTime > 3000; // 3 seconds
  }
  return false;
}

/**
 * Get page load metrics
 * @returns {Object} Page load metrics
 */
export function getPageLoadMetrics() {
  if (!('performance' in window) || !('timing' in window.performance)) {
    return null;
  }

  const timing = window.performance.timing;
  
  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    dom: timing.domComplete - timing.domLoading,
    load: timing.loadEventEnd - timing.navigationStart
  };
}

