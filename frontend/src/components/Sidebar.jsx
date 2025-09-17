import React from 'react';

const Sidebar = ({ currentPage, setPage }) => {
  const sidebarItems = [
    { name: 'Dashboard', page: 'dashboard', icon: 'bi-grid', disabled: true }, 
    { name: 'Forms', page: 'list', icon: 'bi-file-earmark-text' },
    { name: 'Form Builder', page: 'builder', icon: 'bi-ui-checks' },
    { name: 'Submissions', page: 'all-subs', icon: 'bi-box-arrow-in-down-right' },
    { name: 'Preview', page: 'preview', icon: 'bi-eye' },
    { name: 'Settings', page: 'settings', icon: 'bi-gear', disabled: true },
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end" style={{ width: '250px', height: '100vh' }}>
      <h5 className="mb-4 text-secondary">Form Builder</h5>
      <p className="small text-secondary mb-4">Manage your forms</p>

      <ul className="nav nav-pills flex-column mb-auto">
        {sidebarItems.map((item) => (
          <li className="nav-item mb-2" key={item.page}>
            <button
              className={`nav-link text-start ${currentPage === item.page ? 'active bg-primary text-white fw-bold' : 'text-secondary'}`}
              onClick={() => setPage(item.page)}
              disabled={item.disabled}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;