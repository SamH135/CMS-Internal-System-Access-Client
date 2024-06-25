import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const initialState = {
  token: localStorage.getItem('token'),
  userType: localStorage.getItem('userType'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userType', action.payload.userType);
      return {
        ...state,
        token: action.payload.token,
        userType: action.payload.userType,
        isAuthenticated: true,
      };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      return {
        ...state,
        token: null,
        userType: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;