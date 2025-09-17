import React, { useEffect, useState } from 'react';
import { fetchForm, submitForm } from '../Api/api.js';

export default function FormPreview({ form, onBack }) {
  const [f, setF] = useState(form);
  const [data, setData] = useState({});

  useEffect(() => {
    if (form && form.id) {
      fetchForm(form.id).then(json => setF(json));
    } else {
      setF(form);
    }
  }, [form]);

  if (!f) return <div>Loading...</div>;

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field.id]: value }));
  };

  const validateAndSend = async () => {
    // build answers array: {field_id, value}
    const answers = [];
    for (const field of (f.fields || [])) {
      const val = data[field.id];
      if (field.required && (val === undefined || val === '' || (Array.isArray(val) && val.length === 0))) {
        return alert(`Field "${field.label}" is required`);
      }
      answers.push({ field_id: field.id, value: val ?? '' });
    }
    const res = await submitForm(f.id, answers);
    if (res.status === 201) {
      alert('Submission saved');
      setData({}); // reset
    } else {
      alert('Error: ' + (res.body.message || JSON.stringify(res.body)));
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 card p-4">
        <button className="btn btn-outline-secondary btn-sm mb-3" onClick={onBack}>← Back</button>
        <h3>{f.title}</h3>
        <p className="text-muted">Preview</p>

        <form onSubmit={e => { e.preventDefault(); validateAndSend(); }}>
          {(f.fields || []).sort((a, b) => a.order - b.order).map(field => (
            <div className="mb-3" key={field.id}>
              <label className="form-label">{field.label}{field.required && <span className="text-danger"> *</span>}</label>

              {field.type === 'text' && (
                <input type="text" className="form-control"
                  value={data[field.id] || ''} onChange={e => handleChange(field, e.target.value)} />
              )}

              {field.type === 'textarea' && (
                <textarea className="form-control" value={data[field.id] || ''} onChange={e => handleChange(field, e.target.value)} />
              )}

              {field.type === 'radio' && (field.options || []).map((op, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="radio" name={`f${field.id}`} id={`f${field.id}_${i}`}
                    checked={data[field.id] === op.label}
                    onChange={() => handleChange(field, op.label)} />
                  <label className="form-check-label">{op.label}</label>
                </div>
              ))}

              {field.type === 'checkbox' && (field.options || []).map((op, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox"
                    checked={(data[field.id] || []).includes(op.label)}
                    onChange={e => {
                      const cur = new Set(data[field.id] || []);
                      if (e.target.checked) cur.add(op.label); else cur.delete(op.label);
                      handleChange(field, Array.from(cur));
                    }} />
                  <label className="form-check-label">{op.label}</label>
                </div>
              ))}

              {/* Correct placement for new select field type */}
              {field.type === 'select' && (
                <select className="form-select" value={data[field.id] || ''} onChange={e => handleChange(field, e.target.value)}>
                  <option value="">Select an option...</option>
                  {(field.options || []).map((op, i) => (
                    <option key={i} value={op.value}>{op.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <div className="d-grid">
            <button className="btn btn-primary">Submit Form</button>
          </div>
        </form>
      </div>
    </div>
  );
}
