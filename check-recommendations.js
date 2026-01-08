/**
 * Comprehensive Recommendation Status Checker
 * Reads Update-recommendations-pending.html and checks current implementation status
 * Generates a detailed status report for each recommendation
 */

import fs from 'fs';
import path from 'path';

const RECOMMENDATIONS_FILE = './coaching/Update-recommendations-pending.html';
const OUTPUT_FILE = './RECOMMENDATIONS_STATUS_REPORT.md';

// Recommendation categories extracted from the HTML file
const CATEGORIES = {
  'Repository Structure': {
    checks: [
      { id: 'repo-1', desc: '.gitignore for backup files', files: ['.gitignore'], pattern: /\.backup|\.bak/ },
      { id: 'repo-2', desc: 'No backup files in repository', pattern: /\.backup|\.bak/ },
      { id: 'repo-3', desc: 'Python dependencies listed (requirements.txt)', files: ['requirements.txt'] },
      { id: 'repo-4', desc: 'CI/CD pipeline (GitHub Actions)', files: ['.github/workflows'] },
      { id: 'repo-5', desc: 'Branches for development', git: 'checkBranches' }
    ]
  },
  'Code Organization': {
    checks: [
      { id: 'code-1', desc: 'Shared utilities directory exists', files: ['shared/'] },
      { id: 'code-2', desc: 'Shared utils.js with common functions', files: ['shared/utils.js'], pattern: /ErrorHandler|DataStore|DOMUtils|ScoringUtils/ },
      { id: 'code-3', desc: 'Code duplication reduced across engines', engines: 'checkDuplication' },
      { id: 'code-4', desc: 'Backup files removed from repo', pattern: /\.backup|\.bak/, negate: true }
    ]
  },
  'Performance Optimization': {
    checks: [
      { id: 'perf-1', desc: 'Lazy loading for images', pattern: /loading=["\']lazy["\']|data-src/ },
      { id: 'perf-2', desc: 'Dynamic imports for data modules', pattern: /await import\(|loadDataModule/ },
      { id: 'perf-3', desc: 'Script defer/async attributes', pattern: /defer|async|type=["\']module["\']/ },
      { id: 'perf-4', desc: 'Resource hints (preload, preconnect)', pattern: /rel=["\']preload["\']|rel=["\']preconnect["\']/ },
      { id: 'perf-5', desc: 'Performance monitoring implemented', files: ['shared/performance-monitor.js'] },
      { id: 'perf-6', desc: 'Build/minification step', files: ['package.json'], pattern: /terser|esbuild|rollup/ }
    ]
  },
  'Error Handling': {
    checks: [
      { id: 'error-1', desc: 'Centralized error handling (ErrorHandler)', files: ['shared/utils.js'], pattern: /ErrorHandler/ },
      { id: 'error-2', desc: 'Error handling in all engines', engines: 'checkErrorHandling' },
      { id: 'error-3', desc: 'User-friendly error messages', pattern: /showUserError|ErrorHandler\.showUserError/ },
      { id: 'error-4', desc: 'Try-catch blocks in critical paths', engines: 'checkTryCatch' }
    ]
  },
  'Accessibility (A11y)': {
    checks: [
      { id: 'a11y-1', desc: 'ARIA labels on interactive elements', pattern: /aria-label|aria-labelledby|role=/ },
      { id: 'a11y-2', desc: 'Keyboard navigation support', pattern: /keydown|keyup|tabindex/ },
      { id: 'a11y-3', desc: 'Focus management (DOMUtils.focusElement)', pattern: /focusElement|\.focus\(\)/ },
      { id: 'a11y-4', desc: 'aria-live regions for dynamic content', pattern: /aria-live/ },
      { id: 'a11y-5', desc: 'Minimum touch target sizes (44px)', files: ['style.css'], pattern: /min-height.*44|min-width.*44/ },
      { id: 'a11y-6', desc: 'Contrast ratios meet WCAG AA', files: ['style.css'] },
      { id: 'a11y-7', desc: 'Skip links for keyboard users', pattern: /skip-link|skip.*main/ }
    ]
  },
  'Mobile Optimization': {
    checks: [
      { id: 'mobile-1', desc: 'Responsive viewport meta tag', pattern: /viewport.*width=device-width/ },
      { id: 'mobile-2', desc: 'Fluid typography (clamp, rem)', files: ['style.css'], pattern: /clamp\(|font-size.*rem/ },
      { id: 'mobile-3', desc: 'Touch-friendly button sizes', files: ['style.css'], pattern: /min-height.*44|padding.*1rem/ },
      { id: 'mobile-4', desc: 'Mobile-specific media queries', files: ['style.css'], pattern: /@media.*max-width/ },
      { id: 'mobile-5', desc: 'Prevent iOS zoom on input focus', files: ['style.css'], pattern: /font-size.*16px/ }
    ]
  },
  'Data Management': {
    checks: [
      { id: 'data-1', desc: 'DataStore class for versioned storage', files: ['shared/utils.js'], pattern: /class DataStore|DataStore/ },
      { id: 'data-2', desc: 'Data migration support', files: ['shared/utils.js'], pattern: /migrate|version/ },
      { id: 'data-3', desc: 'Async data loading (loadDataModule)', files: ['shared/data-loader.js'] },
      { id: 'data-4', desc: 'Debug reporter for data tracking', files: ['shared/debug-reporter.js'] }
    ]
  },
  'Security': {
    checks: [
      { id: 'sec-1', desc: 'Input sanitization (SecurityUtils)', files: ['shared/utils.js'], pattern: /sanitizeHTML|SecurityUtils/ },
      { id: 'sec-2', desc: 'XSS prevention in innerHTML usage', engines: 'checkSanitization' },
      { id: 'sec-3', desc: 'Content Security Policy header', files: ['index.html'], pattern: /Content-Security-Policy/ }
    ]
  },
  'Testing & QA': {
    checks: [
      { id: 'test-1', desc: 'Unit test setup (Jest, Mocha, etc.)', files: ['package.json'], pattern: /jest|mocha|vitest/ },
      { id: 'test-2', desc: 'Test files exist', files: ['test/', '__tests__/', '*.test.js'] },
      { id: 'test-3', desc: 'Linting setup (ESLint)', files: ['.eslintrc', 'eslint.config.js'] }
    ]
  },
  'Documentation': {
    checks: [
      { id: 'doc-1', desc: 'JSDoc comments in engine files', engines: 'checkJSDoc' },
      { id: 'doc-2', desc: 'README for shared utilities', files: ['shared/README.md'] },
      { id: 'doc-3', desc: 'Integration guide for engines', files: ['ENGINE_INTEGRATION_GUIDE.md', 'docs/'] }
    ]
  },
  'Build System': {
    checks: [
      { id: 'build-1', desc: 'Package.json with build scripts', files: ['package.json'] },
      { id: 'build-2', desc: 'Build output directory configured', files: ['package.json'], pattern: /dist|build/ },
      { id: 'build-3', desc: 'Source maps for debugging', files: ['package.json'], pattern: /source.*map/ }
    ]
  },
  'PWA Capabilities': {
    checks: [
      { id: 'pwa-1', desc: 'Service worker file', files: ['service-worker.js', 'sw.js'] },
      { id: 'pwa-2', desc: 'Web app manifest', files: ['manifest.json', 'site.webmanifest'] },
      { id: 'pwa-3', desc: 'Offline support', files: ['service-worker.js'], pattern: /offline|cache/ }
    ]
  }
};

// Engine files to check
const ENGINE_FILES = [
  'sovereignty-engine.js',
  'archetype-engine.js',
  'manipulation-engine.js',
  'coaching-engine.js',
  'relationship-engine.js',
  'paradigm-engine.js',
  'temperament-engine.js',
  'channels-engine.js',
  'needs-dependency-engine.js',
  'diagnosis-engine.js',
  'character-sheet-engine.js'
];

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (e) {
    return false;
  }
}

/**
 * Check if a file contains a pattern
 */
function fileContainsPattern(filePath, pattern) {
  try {
    if (!fileExists(filePath)) return false;
    const content = fs.readFileSync(filePath, 'utf8');
    return pattern.test(content);
  } catch (e) {
    return false;
  }
}

/**
 * Check all files in a directory for a pattern
 */
function checkFilesInDirectory(dir, pattern, negate = false) {
  try {
    if (!fileExists(dir)) return negate ? { status: 'success', note: 'Directory does not exist (expected for negate check)' } : { status: 'fail', note: 'Directory does not exist' };
    
    const files = fs.readdirSync(dir, { recursive: true });
    let found = false;
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isFile()) {
        if (fileContainsPattern(fullPath, pattern)) {
          found = true;
          break;
        }
      }
    }
    
    if (negate) {
      return found ? { status: 'fail', note: 'Pattern found in files (should not exist)' } : { status: 'success', note: 'Pattern not found' };
    }
    return found ? { status: 'success', note: 'Pattern found' } : { status: 'fail', note: 'Pattern not found' };
  } catch (e) {
    return { status: 'error', note: `Error checking directory: ${e.message}` };
  }
}

/**
 * Check engine-specific patterns
 */
function checkEnginePattern(engines, pattern, checkType) {
  const results = [];
  
  for (const engine of ENGINE_FILES) {
    if (!fileExists(engine)) {
      results.push({ engine, status: 'skip', note: 'File does not exist' });
      continue;
    }
    
    const content = fs.readFileSync(engine, 'utf8');
    let status = 'fail';
    let note = '';
    
    switch (checkType) {
      case 'checkErrorHandling':
        const hasErrorHandler = /ErrorHandler|try\s*\{|catch\s*\(/.test(content);
        status = hasErrorHandler ? 'success' : 'fail';
        note = hasErrorHandler ? 'Error handling found' : 'No error handling found';
        break;
        
      case 'checkTryCatch':
        const hasTryCatch = /try\s*\{[\s\S]*?catch\s*\(/.test(content);
        status = hasTryCatch ? 'success' : 'fail';
        note = hasTryCatch ? 'Try-catch blocks found' : 'No try-catch blocks found';
        break;
        
      case 'checkSanitization':
        const hasSanitization = /sanitize|SecurityUtils|textContent/.test(content);
        const usesInnerHTML = /\.innerHTML\s*=/.test(content);
        status = (hasSanitization || !usesInnerHTML) ? 'success' : 'partial';
        note = hasSanitization ? 'Sanitization found' : (usesInnerHTML ? 'Uses innerHTML without sanitization' : 'No innerHTML usage');
        break;
        
      case 'checkJSDoc':
        const hasJSDoc = /\/\*\*[\s\S]*?\*\/|@param|@returns|@description/.test(content);
        status = hasJSDoc ? 'success' : 'fail';
        note = hasJSDoc ? 'JSDoc comments found' : 'No JSDoc comments found';
        break;
        
      case 'checkDuplication':
        // Check if engine uses shared utilities
        const usesSharedUtils = /from ['"]\.\/shared\/utils|import.*shared\/utils/.test(content);
        status = usesSharedUtils ? 'success' : 'fail';
        note = usesSharedUtils ? 'Uses shared utilities' : 'Does not use shared utilities';
        break;
        
      default:
        status = pattern ? (pattern.test(content) ? 'success' : 'fail') : 'unknown';
        note = pattern ? 'Pattern check' : 'Unknown check type';
    }
    
    results.push({ engine, status, note });
  }
  
  return results;
}

/**
 * Generate status report
 */
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    categories: {},
    summary: {
      total: 0,
      success: 0,
      partial: 0,
      fail: 0,
      skip: 0
    }
  };
  
  console.log('Checking recommendations...\n');
  
  for (const [categoryName, category] of Object.entries(CATEGORIES)) {
    console.log(`Checking ${categoryName}...`);
    report.categories[categoryName] = {
      checks: []
    };
    
    for (const check of category.checks) {
      let result = { id: check.id, desc: check.desc, status: 'unknown', note: '' };
      
      // Check file existence
      if (check.files) {
        if (typeof check.files === 'string') {
          check.files = [check.files];
        }
        
        let fileFound = false;
        for (const file of check.files) {
          if (fileExists(file)) {
            fileFound = true;
            if (check.pattern) {
              const patternMatch = fileContainsPattern(file, check.pattern);
              result.status = patternMatch ? 'success' : 'fail';
              result.note = patternMatch ? `Pattern found in ${file}` : `Pattern not found in ${file}`;
            } else {
              result.status = 'success';
              result.note = `File exists: ${file}`;
            }
            break;
          }
        }
        
        if (!fileFound) {
          result.status = 'fail';
          result.note = `Files not found: ${check.files.join(', ')}`;
        }
      }
      // Check engines
      else if (check.engines) {
        const engineResults = checkEnginePattern(ENGINE_FILES, check.pattern, check.engines);
        const successCount = engineResults.filter(r => r.status === 'success').length;
        const totalCount = engineResults.filter(r => r.status !== 'skip').length;
        
        if (totalCount === 0) {
          result.status = 'skip';
          result.note = 'No engines to check';
        } else if (successCount === totalCount) {
          result.status = 'success';
          result.note = `${successCount}/${totalCount} engines pass`;
        } else if (successCount > 0) {
          result.status = 'partial';
          result.note = `${successCount}/${totalCount} engines pass`;
        } else {
          result.status = 'fail';
          result.note = `0/${totalCount} engines pass`;
        }
        result.details = engineResults;
      }
      // Check pattern in codebase
      else if (check.pattern) {
        const dirResult = checkFilesInDirectory('.', check.pattern, check.negate || false);
        result.status = dirResult.status;
        result.note = dirResult.note;
      }
      // Check git branches (placeholder)
      else if (check.git === 'checkBranches') {
        result.status = 'skip';
        result.note = 'Git branch check requires git CLI (not implemented)';
      }
      
      report.categories[categoryName].checks.push(result);
      report.summary.total++;
      
      if (result.status === 'success') report.summary.success++;
      else if (result.status === 'partial') report.summary.partial++;
      else if (result.status === 'fail') report.summary.fail++;
      else if (result.status === 'skip') report.summary.skip++;
    }
  }
  
  return report;
}

/**
 * Format report as Markdown
 */
function formatMarkdownReport(report) {
  let md = `# Recommendations Status Report\n\n`;
  md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
  
  md += `## Summary\n\n`;
  md += `| Status | Count | Percentage |\n`;
  md += `|--------|-------|------------|\n`;
  md += `| ✅ Success | ${report.summary.success} | ${((report.summary.success / report.summary.total) * 100).toFixed(1)}% |\n`;
  md += `| ⚠️ Partial | ${report.summary.partial} | ${((report.summary.partial / report.summary.total) * 100).toFixed(1)}% |\n`;
  md += `| ❌ Fail | ${report.summary.fail} | ${((report.summary.fail / report.summary.total) * 100).toFixed(1)}% |\n`;
  md += `| ⏭️ Skip | ${report.summary.skip} | ${((report.summary.skip / report.summary.total) * 100).toFixed(1)}% |\n`;
  md += `| **Total** | **${report.summary.total}** | **100%** |\n\n`;
  
  md += `## Detailed Status by Category\n\n`;
  
  for (const [categoryName, category] of Object.entries(report.categories)) {
    md += `### ${categoryName}\n\n`;
    md += `| ID | Description | Status | Notes |\n`;
    md += `|----|-------------|--------|-------|\n`;
    
    for (const check of category.checks) {
      const statusIcon = 
        check.status === 'success' ? '✅' :
        check.status === 'partial' ? '⚠️' :
        check.status === 'fail' ? '❌' :
        '⏭️';
      
      md += `| ${check.id} | ${check.desc} | ${statusIcon} ${check.status.toUpperCase()} | ${check.note} |\n`;
      
      // Add engine-specific details
      if (check.details) {
        md += `| | **Engine Details:** | | |\n`;
        for (const detail of check.details) {
          const detailIcon = detail.status === 'success' ? '✅' : detail.status === 'fail' ? '❌' : '⏭️';
          md += `| | - ${detail.engine} | ${detailIcon} | ${detail.note} |\n`;
        }
      }
    }
    
    md += `\n`;
  }
  
  md += `---\n\n`;
  md += `## Next Steps\n\n`;
  md += `1. Review failed checks and implement missing features\n`;
  md += `2. Address partial implementations across all engines\n`;
  md += `3. Verify success items are fully integrated\n`;
  md += `4. Run this report regularly to track progress\n\n`;
  
  return md;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const report = generateReport();
  const markdown = formatMarkdownReport(report);
  
  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf8');
  console.log(`\n✅ Report generated: ${OUTPUT_FILE}`);
  console.log(`\nSummary: ${report.summary.success}/${report.summary.total} checks passing`);
  console.log(`   Success: ${report.summary.success}`);
  console.log(`   Partial: ${report.summary.partial}`);
  console.log(`   Failed: ${report.summary.fail}`);
  console.log(`   Skipped: ${report.summary.skip}`);
}

export { generateReport, formatMarkdownReport, CATEGORIES, ENGINE_FILES };

