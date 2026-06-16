import React, { useState } from 'react'
import {
  scoreColor,
  scoreLabel,
  stateMeta,
  relativeTime,
  langColor,
} from '../lib/score.js'

export default function RepoRow({ repo }) {
  const [open, setOpen] = useState(false)
  const color = scoreColor(repo.health)
  const state = stateMeta(repo.state)

  return (
    <div className={`row ${open ? 'open' : ''}`}>
      <button
        className="row-main"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="row-id">
          <div className="name-line">
            <span className="name">{repo.name}</span>
            {repo.isFork && <span className="tag">fork</span>}
            {repo.isPrivate && <span className="tag">private</span>}
          </div>
          {repo.description && <p className="desc">{repo.description}</p>}
          <div className="meta">
            {repo.language && (
              <span className="meta-item">
                <span
                  className="lang-dot"
                  style={{ background: langColor(repo.language) }}
                />
                {repo.language}
              </span>
            )}
            <span className="meta-item">★ {repo.stars.toLocaleString()}</span>
            <span className="meta-item">⑂ {repo.forks.toLocaleString()}</span>
            <span className="meta-item">Updated {relativeTime(repo.pushedAt)}</span>
          </div>
        </div>

        <span className={`badge ${state.cls}`}>{state.label}</span>

        <div className="score">
          <div className="score-track">
            <div
              className="score-fill"
              style={{ width: `${repo.health}%`, background: color }}
            />
          </div>
          <span className="score-num" style={{ color }}>
            {repo.health}
          </span>
        </div>

        <span className="chevron" style={{ color }} aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div className="breakdown">
          <div className="breakdown-head">
            <span className="breakdown-label" style={{ color }}>
              {scoreLabel(repo.health)} · {repo.health}/100
            </span>
            <a
              className="repo-link"
              href={repo.url}
              target="_blank"
              rel="noreferrer"
            >
              Open on GitHub ↗
            </a>
          </div>

          <ul className="factors">
            {repo.breakdown.map((b) => {
              const ok = b.earned === b.max
              const partial = !ok && b.earned > 0
              return (
                <li
                  key={b.key}
                  className={`factor ${ok ? 'met' : partial ? 'partial' : 'missed'}`}
                >
                  <span className="factor-mark" aria-hidden>
                    {ok ? '✓' : partial ? '◐' : '○'}
                  </span>
                  <span className="factor-label">{b.label}</span>
                  <span className="factor-pts">
                    {b.earned}/{b.max}
                  </span>
                  {!ok && <span className="factor-hint">{b.hint}</span>}
                </li>
              )
            })}
          </ul>

          {repo.topics.length > 0 && (
            <div className="topics">
              {repo.topics.map((t) => (
                <span key={t} className="topic">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
