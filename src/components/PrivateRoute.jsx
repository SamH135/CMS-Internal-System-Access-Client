import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const token = useSelector((state) => state.auth.token);
  const userType = useSelector((state) => state.auth.userType);

  return token && (!roles || roles.includes(userType)) ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;