import React, { useEffect, useState } from 'react';
import { fetchSubmissions, fetchSubmission } from '../Api/api.js';

export default function SubmissionsList({ form, onBack }) {
  const [subs, setSubs] = useState([]);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (form && form.id) load();
  }, [form]);

  async function load() {
    setSubs(await fetchSubmissions(form.id));
  }

  async function view(id) {
    setDetail(await fetchSubmission(id));
  }

  return (
    <div>
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>← Back</button>
      <h4>Submissions: {form.title}</h4>
      {subs.length === 0 && <div className="alert alert-light">No submissions yet.</div>}
      <ul className="list-group mb-3">
        {subs.map(s => (
          <li className="list-group-item d-flex justify-content-between align-items-center" key={s.id}>
            <div>Submission #{s.id} <small className="text-muted">({new Date(s.created_at).toLocaleString()})</small></div>
            <button className="btn btn-sm btn-outline-primary" onClick={() => view(s.id)}>View</button>
          </li>
        ))}
      </ul>

      {detail && (
        <div className="card p-3">
          <h5>Submission #{detail.id}</h5>
          <div>
            {(detail.answers || []).map(a => (
              <div key={a.id} className="mb-2">
                <strong>{a.field?.label ?? 'Field'}</strong>
                <div>{(() => {
                  try {
                    const v = JSON.parse(a.value);
                    return Array.isArray(v) ? v.join(', ') : String(v);
                  } catch (e) { return a.value; }
                })()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
