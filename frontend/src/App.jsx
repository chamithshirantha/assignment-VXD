import { useState } from 'react'
import FormsList from './components/FormsList';
import FormBuilder from './components/FormBuilder';
import FormPreview from './components/FormPreview';
import SubmissionsList from './components/SubmissionsList';
import Sidebar from './components/Sidebar';
import AllSubmissions from './components/AllSubmissions';


function App() {
  const [page, setPage] = useState('list'); // Default active page is Forms ('list')
  const [editForm, setEditForm] = useState(null);
  const [previewForm, setPreviewForm] = useState(null);

  const gotoBuilder = (form = null) => { setEditForm(form); setPage('builder'); }
  const gotoPreview = (form) => { setPreviewForm(form); setPage('preview'); }
  const gotoSubs = (form) => { setEditForm(form); setPage('subs'); }

  return (
    <>
      <div className="d-flex">
        <Sidebar currentPage={page} setPage={setPage} gotoBuilder={gotoBuilder} />

        <div className="flex-grow-1 p-4">
          {page === 'list' && <FormsList onEdit={gotoBuilder} onPreview={gotoPreview} onSubs={gotoSubs} />}
          {page === 'builder' && <FormBuilder form={editForm} onSaved={() => setPage('list')} onPreview={(f) => gotoPreview(f)} />}
          {page === 'preview' && <FormPreview form={previewForm} onBack={() => setPage('list')} />}
          {page === 'all-subs' && <AllSubmissions />}
          {page === 'subs' && <SubmissionsList form={editForm} onBack={() => setPage('list')} />}
        </div>
      </div>
    </>
  );
}

export default App
