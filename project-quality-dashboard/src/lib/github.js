// github.js — the real data source.
//
// This replaces the old localStorage "fake projects" entirely. Instead of
// typing in a project and a made-up quality number, we pull your actual
// repositories from GitHub and compute a health score from each repo's
// real metadata. One network call loads up to 100 repos.
//
// Unauthenticated requests are limited to 60/hour per IP (plenty for a
// personal dashboard). Pass a token to raise that to 5,000/hour AND to
// include your private repos.

const API = 'https://api.github.com'

// ---- Fetching -------------------------------------------------------------

export async function fetchRepos({ username, token }) {
  const headers = { Accept: 'application/vnd.github+json' }
  if (token) headers.Authorization = `Bearer ${token}`

  // With a token we can read the authenticated user's repos (incl. private).
  // Without one, we read a public user's repos by name.
  const url = token
    ? `${API}/user/repos?per_page=100&sort=pushed&affiliation=owner`
    : `${API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`

  const res = await fetch(url, { headers })

  if (!res.ok) {
    throw await describeError(res, username, token)
  }

  const raw = await res.json()
  return raw.map(mapRepo).sort((a, b) => b.health - a.health)
}

// Turn GitHub's error responses into messages a person can act on.
async function describeError(res, username, token) {
  const remaining = res.headers.get('x-ratelimit-remaining')

  if (res.status === 404) {
    return new Error(
      `No GitHub user named "${username}". Check the spelling.`
    )
  }
  if (res.status === 401) {
    return new Error('That token was rejected. Check it and try again.')
  }
  if (res.status === 403 && remaining === '0') {
    const reset = res.headers.get('x-ratelimit-reset')
    const mins = reset
      ? Math.max(1, Math.ceil((reset * 1000 - Date.now()) / 60000))
      : null
    return new Error(
      token
        ? `Rate limit reached. Try again in about ${mins} min.`
        : `Rate limit reached (60/hour without a token). Add a token below, or try again in about ${mins} min.`
    )
  }
  return new Error(`GitHub returned ${res.status}. Try again in a moment.`)
}

// ---- Mapping --------------------------------------------------------------

// Reduce GitHub's large repo object to just what the dashboard needs,
// and attach the computed health score + its breakdown.
function mapRepo(r) {
  const { health, breakdown } = computeHealth(r)
  return {
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    url: r.html_url,
    homepage: r.homepage || null,
    description: r.description || '',
    language: r.language || null,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    topics: r.topics || [],
    license: r.license ? r.license.spdx_id || r.license.name : null,
    isFork: r.fork,
    isArchived: r.archived,
    isPrivate: r.private,
    pushedAt: r.pushed_at,
    state: deriveState(r),
    health,
    breakdown,
  }
}

// Repos don't have a "status" field, so derive a meaningful one from
// activity. This replaces the old ongoing/in-progress/completed.
function deriveState(r) {
  if (r.archived) return 'archived'
  const days = daysSince(r.pushed_at)
  if (days <= 60) return 'active'
  return 'idle'
}

// ---- Health score ---------------------------------------------------------
//
// A transparent, repeatable 0–100 score built ONLY from the repo listing
// payload, so it costs no extra API calls. Each factor is something you can
// actually fix, and the breakdown is shown in the UI so the number is never
// a black box.

const FACTORS = [
  {
    key: 'description',
    label: 'Has a description',
    max: 20,
    score: (r) => (r.description && r.description.trim() ? 20 : 0),
    hint: 'Add a one-line description so people know what it is.',
  },
  {
    key: 'license',
    label: 'Has a license',
    max: 15,
    score: (r) => (r.license ? 15 : 0),
    hint: 'Add a LICENSE so others know how they can use it.',
  },
  {
    key: 'topics',
    label: 'Has topics',
    max: 15,
    score: (r) => ((r.topics || []).length ? 15 : 0),
    hint: 'Add topics to make the repo discoverable.',
  },
  {
    key: 'homepage',
    label: 'Has a homepage / demo',
    max: 10,
    score: (r) => (r.homepage ? 10 : 0),
    hint: 'Link a live demo or docs site in the repo’s homepage field.',
  },
  {
    key: 'maintained',
    label: 'Not archived',
    max: 10,
    score: (r) => (r.archived ? 0 : 10),
    hint: 'Archived repos read as finished or abandoned.',
  },
  {
    key: 'freshness',
    label: 'Recently updated',
    max: 30,
    // Full marks within 90 days, sliding to 0 at ~2 years stale.
    score: (r) => {
      if (r.archived) return 0
      const days = daysSince(r.pushed_at)
      if (days <= 90) return 30
      if (days >= 730) return 0
      return Math.round(30 * (1 - (days - 90) / (730 - 90)))
    },
    hint: 'Push an update — this repo is getting stale.',
  },
]

export function computeHealth(r) {
  const breakdown = FACTORS.map((f) => ({
    key: f.key,
    label: f.label,
    earned: f.score(r),
    max: f.max,
    hint: f.hint,
  }))
  const health = breakdown.reduce((sum, b) => sum + b.earned, 0)
  return { health, breakdown }
}

// ---- Small date helpers ---------------------------------------------------

function daysSince(iso) {
  return (Date.now() - new Date(iso).getTime()) / 86400000
}
