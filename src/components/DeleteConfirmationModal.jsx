// DeleteConfirmationModal.jsx
import React, { useState } from 'react';

const DeleteConfirmationModal = ({ show, onHide, onConfirm, itemType }) => {
  const [passcode, setPasscode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(passcode);
    setPasscode('');
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="close" onClick={onHide} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this {itemType}? This action cannot be undone.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="passcode">Enter 4-digit passcode to confirm:</label>
                <input
                  type="password"
                  className="form-control"
                  id="passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={handleSubmit}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;