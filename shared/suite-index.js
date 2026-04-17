import { getSuiteCompletion } from './suite-completion.js';

function renderSuiteProgress() {
  const list = document.getElementById('suite-progress-list');
  if (!list) return;
  const completion = getSuiteCompletion();
  const html = completion.items.map((item) => {
    const status = item.completed ? 'Complete' : 'Pending';
    const icon = item.completed ? '✓' : '○';
    return `<li><a href="${item.href}">${icon} ${item.label}</a> <span>${status}</span></li>`;
  }).join('');
  list.innerHTML = html;

  const summary = document.getElementById('suite-progress-summary');
  if (summary) {
    summary.textContent = `${completion.completeCount}/${completion.totalCount} tools completed`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderSuiteProgress);
} else {
  renderSuiteProgress();
}
