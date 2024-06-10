import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('regular');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', { userID, username, userType, password, confirmPassword });
      // Handle successful registration, e.g., redirect to login
    } catch (error) {
      setMessage('An error occurred during registration');
    }
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            Add User
          </div>

          <div className="card-body">
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="userID">User ID:</label>
                <input type="text" className="form-control" id="userID" name="userID" placeholder="Enter User ID" value={userID} onChange={(e) => setUserID(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" id="username" name="username" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="userType">User Type:</label>
                <select className="form-control" id="userType" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option value="regular">Regular</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password" name="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
        {message && <h4 className="alert alert-danger mt-4">{message}</h4>}
      </div>
    </div>
  );
};

export default Register;