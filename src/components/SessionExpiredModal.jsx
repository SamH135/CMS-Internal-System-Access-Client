import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = ({ show, onHide }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onHide();
    navigate('/login');
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Session Expired</h5>
          <button onClick={onHide} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          Your session has timed out (sessions last for (1) hour for security purposes). Please log in again to continue.
          If you're seeing this message and you just logged in, ignore it and click the X at the top.
        </div>
        <div className="modal-footer">
          <button onClick={handleLogin} className="btn-primary">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;