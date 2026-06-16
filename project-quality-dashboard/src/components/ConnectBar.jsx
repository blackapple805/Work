import React, { useState } from 'react'

// The one input that makes the whole thing "yours": whose repos to load.
// Token is optional and only needed for private repos or higher rate limits.
export default function ConnectBar({
  username,
  token,
  loading,
  lastFetched,
  onConnect,
  onRefresh,
}) {
  const [name, setName] = useState(username)
  const [tok, setTok] = useState(token)
  const [showToken, setShowToken] = useState(false)

  function submit() {
    const trimmed = name.trim()
    if (!trimmed) return
    onConnect({ username: trimmed, token: tok.trim() })
  }

  return (
    <div className="connect">
      <div className="connect-row">
        <div className="field field-grow">
          <label htmlFor="gh-user">GitHub username</label>
          <div className="input-prefix">
            <span className="prefix">github.com/</span>
            <input
              id="gh-user"
              type="text"
              value={name}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="blackapple805"
            />
          </div>
        </div>

        <button className="btn" onClick={submit} disabled={loading}>
          {loading ? 'Loading…' : 'Load repos'}
        </button>
        <button
          className="btn btn-ghost"
          onClick={onRefresh}
          disabled={loading}
          title="Re-fetch from GitHub"
        >
          Refresh
        </button>
      </div>

      <button
        type="button"
        className="token-toggle"
        onClick={() => setShowToken((s) => !s)}
        aria-expanded={showToken}
      >
        {showToken ? '–' : '+'} Add a token for private repos &amp; higher limits
      </button>

      {showToken && (
        <div className="field token-field">
          <label htmlFor="gh-token">
            Personal access token <span className="muted">(optional)</span>
          </label>
          <input
            id="gh-token"
            type="password"
            value={tok}
            spellCheck={false}
            onChange={(e) => setTok(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="ghp_…"
          />
          <p className="token-note">
            Stays in this browser only. A read-only token lifts the rate
            limit to 5,000/hour and includes your private repos.
          </p>
        </div>
      )}

      {lastFetched && (
        <p className="last-fetched">
          Last loaded {new Date(lastFetched).toLocaleString()}
        </p>
      )}
    </div>
  )
}
