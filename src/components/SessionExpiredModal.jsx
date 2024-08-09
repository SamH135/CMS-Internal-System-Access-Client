// SessionExpiredModal.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SessionExpiredModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (show && location.pathname === '/login') {
      // If we're on the login page and the modal should show,
      // it means we were redirected here due to session expiration
      const urlParams = new URLSearchParams(location.search);
      if (!urlParams.get('session_expired')) {
        navigate('/login?session_expired=true');
      }
    }
  }, [show, location, navigate]);

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