import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/actions/authActions';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';

const Login = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('session_expired') === 'true') {
      setMessage('Your session has expired. Please log in again.');
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/login', { userID, password });
      const { token } = response.data;
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.userType;
      console.log('Decoded user type:', userType);
      dispatch(loginSuccess(token, userType));
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Invalid credentials');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="class-header text-center">
            <strong>Login</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="userID">User ID:</label>
                <input type="text" className="form-control" id="userID" name="userID" placeholder="Enter User ID" value={userID} onChange={(e) => setUserID(e.target.value)} required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password" name="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
        {message && <h4 className="alert alert-warning mt-4">{message}</h4>}
      </div>
    </div>
  );
};

export default Login;