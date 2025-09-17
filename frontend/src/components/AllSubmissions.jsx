import React, { useEffect, useState } from 'react';
import { fetchForms, fetchSubmissions } from '../Api/api.js';

export default function AllSubmissions({ onBack }) {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      try {
        const forms = await fetchForms();
        const submissionsPromises = forms.map(async (form) => {
          const subs = await fetchSubmissions(form.id);
          return subs.map(sub => ({ ...sub, formTitle: form.title }));
        });
        const allSubs = (await Promise.all(submissionsPromises)).flat();
        setAllSubmissions(allSubs);
      } catch (error) {
        console.error("Failed to fetch all submissions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSubmissions();
  }, []);

  if (loading) {
    return <div>Loading submissions...</div>;
  }

  if (allSubmissions.length === 0) {
    return <div className="alert alert-info mt-3">No submissions found.</div>;
  }

  return (
    <div>
      <h4>All Form Submissions</h4>
      <div className="card p-4">
        {allSubmissions.map(s => (
          <div key={s.id} className="card mb-3 p-3">
            <h5 className="mb-1">Submission #{s.id} from "{s.formTitle}"</h5>
            <small className="text-muted">Submitted: {new Date(s.created_at).toLocaleString()}</small>
            <div className="mt-2">
              {s.answers?.map(a => (
                <div key={a.id}>
                  <strong>{a.field?.label}:</strong>
                  <span> {a.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}