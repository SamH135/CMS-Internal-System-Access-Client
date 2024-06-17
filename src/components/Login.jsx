import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/login', { userID, password });
      const { token } = response.data;
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.userType;
      console.log('Decoded user type:', userType); // Add this line
      dispatch(loginSuccess(token, userType));
      navigate('/dashboard');
    } catch (error) {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div>
      <nav>
        <h4>Inventory Management System</h4>
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
        {message && <h4 className="alert alert-danger mt-4">{message}</h4>}
      </div>
    </div>
  );
};

export default Login;