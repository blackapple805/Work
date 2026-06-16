// storage.js — tiny local persistence layer.
//
// The data itself now comes from GitHub, not from here. localStorage is used
// only to remember your settings (which username/token to load) and to cache
// the last successful fetch so a reload shows your repos instantly while the
// fresh data loads in the background.

const SETTINGS_KEY = 'pqd.settings.v3'
const CACHE_KEY = 'pqd.cache.v3'

const DEFAULT_SETTINGS = {
  username: 'blackapple805', // your account, used until you change it
  token: '',
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    /* unavailable storage — fall through to defaults */
  }
  return { ...DEFAULT_SETTINGS }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* storage blocked (private mode): settings just won't persist */
  }
}

// Cache is keyed by username so switching accounts doesn't show stale repos.
export function loadCache(username) {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cache = JSON.parse(raw)
    if (cache.username !== username) return null
    return cache // { username, repos, fetchedAt }
  } catch {
    return null
  }
}

export function saveCache(username, repos) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ username, repos, fetchedAt: new Date().toISOString() })
    )
  } catch {
    /* token is never written here in plaintext beyond the user's own machine;
       cache holds only public repo metadata */
  }
}
