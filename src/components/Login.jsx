import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { userID, password });
      // Handle successful login, e.g., redirect to dashboard
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