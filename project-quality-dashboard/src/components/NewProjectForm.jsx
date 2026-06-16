import React, { useState } from 'react'
import { addProject, VALID_STATUSES } from '../lib/storage.js'

const STATUS_LABELS = {
  ongoing: 'Ongoing',
  'in progress': 'In progress',
  completed: 'Completed',
}

export default function NewProjectForm({ onAdded }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('ongoing')
  const [qualityScore, setQualityScore] = useState(100)
  const [error, setError] = useState('')

  function handleSubmit() {
    try {
      const project = addProject({ name, status, qualityScore })
      onAdded(project)
      setName('')
      setStatus('ongoing')
      setQualityScore(100)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="form-card">
      <div className="form-grid">
        <div className="field field-wide">
          <label htmlFor="np-name">Project name</label>
          <input
            id="np-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="e.g. Payments rewrite"
          />
        </div>

        <div className="field">
          <label htmlFor="np-status">Status</label>
          <select
            id="np-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="np-score">Quality score</label>
          <input
            id="np-score"
            type="number"
            min={0}
            max={100}
            value={qualityScore}
            onChange={(e) => setQualityScore(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        <button className="btn" onClick={handleSubmit}>
          Add project
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
