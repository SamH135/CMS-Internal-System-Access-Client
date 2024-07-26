// src/components/SessionExpiredModal.jsx

import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = ({ show, onHide }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onHide();
    navigate('/login');
  };

  const modalStyle = {
    color: 'black', // Ensure text color is black
  };

  const headerStyle = {
    borderBottom: '1px solid #dee2e6',
    padding: '1rem',
  };

  const titleStyle = {
    marginBottom: 0,
    lineHeight: 1.5,
    fontSize: '1.25rem',
    fontWeight: 500,
  };

  const bodyStyle = {
    padding: '1rem',
  };

  const footerStyle = {
    borderTop: '1px solid #dee2e6',
    padding: '1rem',
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <div style={modalStyle}>
        <Modal.Header closeButton style={headerStyle}>
          <Modal.Title style={titleStyle}>Session Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body style={bodyStyle}>
          Your session has timed out (sessions last for (1) hour for security purposes). Please log in again to continue.
          If you're seeing this message and you just logged in, ignore it and click the X at the top.
        </Modal.Body>
        <Modal.Footer style={footerStyle}>
          <Button variant="primary" onClick={handleLogin}>
            Log In
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default SessionExpiredModal;