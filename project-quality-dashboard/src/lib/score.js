// score.js — shared helpers for turning data into color, label, and text.
// One place so the summary rail, the rows, and the breakdown all agree.

export function scoreColor(score) {
  if (score >= 80) return 'var(--score-high)'
  if (score >= 50) return 'var(--score-mid)'
  return 'var(--score-low)'
}

export function scoreLabel(score) {
  if (score >= 80) return 'Healthy'
  if (score >= 50) return 'Needs work'
  return 'At risk'
}

// Repo activity state -> badge text + class.
const STATE_META = {
  active: { label: 'Active', cls: 'active' },
  idle: { label: 'Idle', cls: 'idle' },
  archived: { label: 'Archived', cls: 'archived' },
}

export function stateMeta(state) {
  return STATE_META[state] || { label: state, cls: 'idle' }
}

// "3 days ago", "5 months ago" — humans read repos by recency.
export function relativeTime(iso) {
  const ms = Date.now() - new Date(iso).getTime()
  const day = 86400000
  const days = Math.floor(ms / day)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  const years = Math.floor(days / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

// GitHub's own language colors for the dot next to each repo. A small,
// recognizable detail borrowed from the subject's own world.
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  'Jupyter Notebook': '#DA5B0B',
}

export function langColor(language) {
  return LANG_COLORS[language] || 'var(--paper-faint)'
}
