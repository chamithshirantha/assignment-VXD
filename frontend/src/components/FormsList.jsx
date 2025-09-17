import React, {useEffect, useState} from 'react';
import {fetchForms, deleteForm} from '../Api/api.js';

export default function FormsList({onEdit, onPreview, onSubs}){
  const [forms, setForms] = useState([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ setForms(await fetchForms()); }
  async function remove(id){
    if(!window.confirm('Delete this form?')) return;
    await deleteForm(id);
    load();
  }
  return (
    <div>
      {forms.length === 0 && <div className="alert alert-light">No forms yet.</div>}
      <div className="row g-3">
        {forms.map(f => (
          <div className="col-md-6" key={f.id}>
            <div className="card p-3">
              <h5>{f.title}</h5>
              <div className="mt-2">
                <button className="btn btn-primary me-2" onClick={()=>onEdit(f)}>Edit</button>
                <button className="btn btn-outline-secondary me-2" onClick={()=>onPreview(f)}>Preview</button>
                <button className="btn btn-outline-info me-2" onClick={()=>onSubs(f)}>Submissions</button>
                <button className="btn btn-danger float-end" onClick={()=>remove(f.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
