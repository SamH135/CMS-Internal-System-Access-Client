// src/hooks/useInactivityCheck.js

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../redux/actions/authActions';

const useInactivityCheck = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const checkSessionExpiration = useCallback(() => {
    if (token && jwtDecode(token).exp < Date.now() / 1000) {
      dispatch(logout());
      window.dispatchEvent(new CustomEvent('sessionExpired'));
    }
  }, [token, dispatch]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSessionExpiration, 5 * 60 * 1000); // Check after 5 minutes of inactivity
    };

    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer(); // Initial setup

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(timeoutId);
    };
  }, [checkSessionExpiration]);
};

export default useInactivityCheck;