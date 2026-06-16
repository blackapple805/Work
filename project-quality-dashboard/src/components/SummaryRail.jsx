import React from 'react'

// Four numbers that answer "how healthy is this account's work at a glance."
// Derived from the live repo list, so it always matches the rows below.
export default function SummaryRail({ repos }) {
  const total = repos.length
  const avg =
    total === 0
      ? 0
      : Math.round(repos.reduce((s, r) => s + r.health, 0) / total)
  const atRisk = repos.filter((r) => r.health < 50).length
  const stars = repos.reduce((s, r) => s + r.stars, 0)

  return (
    <div className="rail">
      <div className="stat">
        <div className="label">Repos</div>
        <div className="value">{total}</div>
      </div>
      <div className="stat">
        <div className="label">Avg. health</div>
        <div className="value">
          {avg}
          <small>/100</small>
        </div>
      </div>
      <div className="stat">
        <div className="label">At risk</div>
        <div className="value">{atRisk}</div>
      </div>
      <div className="stat">
        <div className="label">Total stars</div>
        <div className="value">{stars.toLocaleString()}</div>
      </div>
    </div>
  )
}
