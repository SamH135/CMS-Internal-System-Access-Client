// authActions.js
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (token, userType) => ({
  type: LOGIN_SUCCESS,
  payload: { token, userType },
});

export const logout = () => ({
  type: LOGOUT,
});