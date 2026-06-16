import React, { useState } from 'react'
import { scoreColor, statusClass, formatDate } from '../lib/score.js'
import { VALID_STATUSES } from '../lib/storage.js'

const STATUS_LABELS = {
  ongoing: 'Ongoing',
  'in progress': 'In progress',
  completed: 'Completed',
}

export default function ProjectRow({ project, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(project)
  const [error, setError] = useState('')

  function startEdit() {
    setDraft(project)
    setError('')
    setEditing(true)
  }

  function commit() {
    try {
      onSave(project.id, {
        name: draft.name,
        status: draft.status,
        qualityScore: draft.qualityScore,
      })
      setEditing(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (editing) {
    return (
      <div className="row editing">
        <div className="edit-grid">
          <input
            className="field-wide"
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            autoFocus
          />
          <select
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value })}
          >
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            max={100}
            value={draft.qualityScore}
            onChange={(e) =>
              setDraft({ ...draft, qualityScore: e.target.value })
            }
          />
          <button className="btn" onClick={commit}>
            Save
          </button>
          <button className="btn btn-ghost" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </div>
    )
  }

  return (
    <div className="row">
      <div>
        <div className="name">{project.name}</div>
        <div className="meta">
          Updated {formatDate(project.updatedAt)}
        </div>
      </div>

      <span className={`badge ${statusClass(project.status)}`}>
        {STATUS_LABELS[project.status]}
      </span>

      <div className="score">
        <div className="score-track">
          <div
            className="score-fill"
            style={{
              width: `${project.qualityScore}%`,
              background: scoreColor(project.qualityScore),
            }}
          />
        </div>
        <span
          className="score-num"
          style={{ color: scoreColor(project.qualityScore) }}
        >
          {project.qualityScore}
        </span>
      </div>

      <div className="actions">
        <button className="icon-btn" onClick={startEdit}>
          Edit
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
