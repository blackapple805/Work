import React from 'react'

const SORTS = [
  { key: 'health', label: 'Health' },
  { key: 'pushed', label: 'Recently updated' },
  { key: 'stars', label: 'Stars' },
  { key: 'name', label: 'Name' },
]

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'idle', label: 'Idle' },
  { key: 'archived', label: 'Archived' },
]

export default function Controls({
  query,
  sort,
  filter,
  onQuery,
  onSort,
  onFilter,
}) {
  return (
    <div className="controls">
      <input
        className="search"
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search repos…"
        aria-label="Search repositories"
      />

      <div className="segmented" role="group" aria-label="Filter by state">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`seg ${filter === f.key ? 'on' : ''}`}
            onClick={() => onFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="field field-inline">
        <label htmlFor="sort">Sort</label>
        <select id="sort" value={sort} onChange={(e) => onSort(e.target.value)}>
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
