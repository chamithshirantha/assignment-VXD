const API_URL = 'http://127.0.0.1:8000/api';

export async function fetchForms()  { 
  return fetch(`${API_URL}/forms`).then(r=>r.json()); 
}
export async function fetchForm(id){ 
  return fetch(`${API_URL}/forms/${id}`).then(r=>r.json()); 
}
export async function createForm(payload){ 
  return fetch(`${API_URL}/forms`, 
    { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)}).then(r=>r.json()); 
  }
export async function updateForm(id,payload){ 
  return fetch(`${API_URL}/forms/${id}`, 
    {method:'PUT', headers:{'Content-Type':'application/json'}, 
    body: JSON.stringify(payload)}).then(r=>r.json()); 
  }
export async function deleteForm(id){ 
  return fetch(`${API_URL}/forms/${id}`, {method:'DELETE'}); 
}

export async function submitForm(formId, answers){
  return fetch(`${API_URL}/forms/${formId}/submissions`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({answers})
  }).then(async r => ({status: r.status, body: await r.json()}));
}

export async function fetchSubmissions(formId){ 
  return fetch(`${API_URL}/forms/${formId}/submissions`).then(r=>r.json()); 
}
export async function fetchSubmission(submissionId){ 
  return fetch(`${API_URL}/submissions/${submissionId}`).then(r=>r.json()); 
}
