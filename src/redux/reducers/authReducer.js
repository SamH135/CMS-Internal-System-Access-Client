// authReducer.js
import { LOGIN_SUCCESS, LOGOUT } from '../actions/authActions';

const initialState = {
  token: null,
  userType: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userType: action.payload.userType,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        userType: null,
      };
    default:
      return state;
  }
};

export default authReducer;