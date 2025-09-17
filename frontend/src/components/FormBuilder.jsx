import React, {useEffect, useState} from 'react';
import {createForm, updateForm} from '../Api/api.js';

function makeField(type){
  return { id: Date.now() + Math.random(), type, label:'', required:false, options: [] };
}

export default function FormBuilder({form, onSaved, onPreview}){
  const [title, setTitle] = useState(form ? form.title : '');
  const [fields, setFields] = useState(form ? (form.fields || []) : []);

  useEffect(()=>{ if(form){ setTitle(form.title); setFields(form.fields || []); } else { setTitle(''); setFields([]); } }, [form]);

  const addField = (type) => setFields(prev => [...prev, makeField(type)]);

  const updateField = (idx, patch) => {
    setFields(prev => prev.map((f,i) => i===idx ? {...f, ...patch} : f));
  };

  const addOption = (idx) => {
    const label = `Option ${fields[idx].options.length + 1}`;
    updateField(idx, {options: [...fields[idx].options, {label, value:label}]});
  };

  const removeField = (idx) => setFields(prev => prev.filter((_,i)=>i!==idx));
  const move = (i, dir) => {
    const arr = [...fields];
    const j = i + dir;
    if(j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setFields(arr);
  };

  const save = async () => {
    if (!title) return alert('Form title required');
    const payload = {
      title,
      fields: fields.map((f, idx) => ({
        type: f.type,
        label: f.label,
        required: !!f.required,
        order: idx,
        options: (f.options || []).map(o => ({label: o.label, value: o.value || o.label}))
      }))
    };
    try{
      if (form && form.id){
        await updateForm(form.id, payload);
      } else {
        await createForm(payload);
      }
      alert('Saved');
      if(onSaved) onSaved();
    } catch(e){
      console.error(e);
      alert('Failed to save');
    }
  };

  return (
    <div className="card p-4">
      <div className="mb-3">
        <label className="form-label">Form Title</label>
        <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Add Fields</label>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={()=>addField('text')}>+ Text Input</button>
          <button className="btn btn-outline-secondary me-2" onClick={()=>addField('textarea')}>+ Text Area</button>
          <button className="btn btn-outline-secondary me-2" onClick={()=>addField('radio')}>+ Radio Button</button>
          <button className="btn btn-outline-secondary me-2" onClick={()=>addField('checkbox')}>+ Checkbox</button>
          <button className="btn btn-outline-secondary me-2" onClick={()=>addField('select')}>+ Selection Field</button> {/* Add new button here */}
        </div>
      </div>

      <div>
        <h6>Form Fields</h6>
        {fields.map((f, idx) => (
          <div key={f.id} className="card mb-2 p-2">
            <div className="d-flex justify-content-between">
              <div><strong>{f.type}</strong> &nbsp; <small className="text-muted">{f.label}</small></div>
              <div>
                <button className="btn btn-sm btn-light me-1" onClick={()=>move(idx, -1)}>↑</button>
                <button className="btn btn-sm btn-light me-1" onClick={()=>move(idx, +1)}>↓</button>
                <button className="btn btn-sm btn-danger" onClick={()=>removeField(idx)}>Delete</button>
              </div>
            </div>

            <div className="mt-2">
              <label className="form-label">Label</label>
              <input className="form-control" value={f.label} onChange={e=>updateField(idx, {label:e.target.value})}/>
            </div>

            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" checked={!!f.required} id={`req-${f.id}`}
                onChange={e=>updateField(idx, {required: e.target.checked})} />
              <label className="form-check-label" htmlFor={`req-${f.id}`}>Required field</label>
            </div>

            {(f.type === 'radio' || f.type === 'checkbox' || f.type === 'select') && ( // Add 'select' to the condition
              <div className="mt-2">
                <label className="form-label">Options</label>
                {(f.options || []).map((op, opIdx) => (
                  <div className="input-group mb-1" key={opIdx}>
                    <input className="form-control" value={op.label}
                      onChange={e=>{
                        const opts = [...f.options]; opts[opIdx].label = e.target.value; opts[opIdx].value = e.target.value;
                        updateField(idx, {options: opts});
                      }} />
                    <button className="btn btn-outline-danger" onClick={()=>{
                      const opts = f.options.filter((_,i)=>i!==opIdx);
                      updateField(idx, {options: opts});
                    }}>✕</button>
                  </div>
                ))}
                <button className="btn btn-sm btn-link" onClick={()=>addOption(idx)}>+ Add Option</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <button className="btn btn-success me-2" onClick={save}>Save Form</button>
        <button className="btn btn-outline-secondary" onClick={()=>onPreview && onPreview({id: form?.id ?? null, title, fields})}>Preview</button>
      </div>
    </div>
  );
}
