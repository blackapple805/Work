import React, { useEffect, useMemo, useState } from 'react'
import { fetchRepos } from './lib/github.js'
import {
  loadSettings,
  saveSettings,
  loadCache,
  saveCache,
} from './lib/storage.js'
import SummaryRail from './components/SummaryRail.jsx'
import ConnectBar from './components/ConnectBar.jsx'
import Controls from './components/Controls.jsx'
import RepoRow from './components/RepoRow.jsx'

export default function App() {
  const initial = loadSettings()
  const [username, setUsername] = useState(initial.username)
  const [token, setToken] = useState(initial.token)

  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastFetched, setLastFetched] = useState(null)

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('health')
  const [filter, setFilter] = useState('all')

  // On first load: show cached repos instantly (if any), then refresh.
  useEffect(() => {
    const cache = loadCache(username)
    if (cache) {
      setRepos(cache.repos)
      setLastFetched(cache.fetchedAt)
    }
    load(username, token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load(user, tok) {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchRepos({ username: user, token: tok })
      setRepos(data)
      const now = new Date().toISOString()
      setLastFetched(now)
      saveCache(user, data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleConnect({ username: user, token: tok }) {
    setUsername(user)
    setToken(tok)
    saveSettings({ username: user, token: tok })
    load(user, tok)
  }

  function handleRefresh() {
    load(username, token)
  }

  const visible = useMemo(() => {
    let list = repos
    if (filter !== 'all') list = list.filter((r) => r.state === filter)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.language || '').toLowerCase().includes(q) ||
          r.topics.some((t) => t.includes(q))
      )
    }
    const sorters = {
      health: (a, b) => b.health - a.health,
      stars: (a, b) => b.stars - a.stars,
      name: (a, b) => a.name.localeCompare(b.name),
      pushed: (a, b) => new Date(b.pushedAt) - new Date(a.pushedAt),
    }
    return [...list].sort(sorters[sort])
  }, [repos, filter, query, sort])

  return (
    <div className="shell">
      <header className="masthead">
        <div className="eyebrow">
          <span className="mark">◆</span>
          <span>Project Quality Dashboard</span>
        </div>
        <h1>
          Your repos, <em>scored for health.</em>
        </h1>
        <p className="sub">
          Live from GitHub. Every repository gets a 0–100 health score built
          from real signals — description, license, topics, demo link, and how
          recently it was touched. Open a row to see exactly what helped or hurt.
        </p>
      </header>

      <ConnectBar
        username={username}
        token={token}
        loading={loading}
        lastFetched={lastFetched}
        onConnect={handleConnect}
        onRefresh={handleRefresh}
      />

      {error && (
        <div className="banner error" role="alert">
          {error}
        </div>
      )}

      <SummaryRail repos={repos} />

      <div className="section-head">
        <h2>Repositories</h2>
        <span className="count">
          {repos.length} {repos.length === 1 ? 'repo' : 'repos'}
        </span>
      </div>

      <Controls
        query={query}
        sort={sort}
        filter={filter}
        onQuery={setQuery}
        onSort={setSort}
        onFilter={setFilter}
      />

      {loading && repos.length === 0 ? (
        <div className="list">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="row skeleton" key={i}>
              <div className="sk-line wide" />
              <div className="sk-line" />
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          {repos.length === 0 ? (
            <>
              <p className="lead">No repos loaded yet.</p>
              <p>Enter a GitHub username above and choose Load repos.</p>
            </>
          ) : (
            <>
              <p className="lead">Nothing matches that.</p>
              <p>Clear the search or pick a different filter.</p>
            </>
          )}
        </div>
      ) : (
        <div className="list">
          {visible.map((r) => (
            <RepoRow key={r.id} repo={r} />
          ))}
        </div>
      )}

      <footer className="foot">
        <span>Data from the GitHub REST API · scores computed in your browser</span>
        <span>Project Quality Dashboard v3</span>
      </footer>
    </div>
  )
}
