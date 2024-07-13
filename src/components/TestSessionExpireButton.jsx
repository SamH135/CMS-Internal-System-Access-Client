// TestSessionExpireButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authActions';

const TestSessionExpireButton = () => {
  const dispatch = useDispatch();

  const handleExpireSession = () => {
    dispatch(logout());
    window.dispatchEvent(new CustomEvent('sessionExpired'));
  };

  return (
    <button onClick={handleExpireSession}>
      Test Session Expiration
    </button>
  );
};

export default TestSessionExpireButton;