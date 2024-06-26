import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('regular');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, { userID, username, userType, password, confirmPassword });
      
      if (response.data.success) {
        setMessage(response.data.message);
        setIsSuccess(true);
        navigate('/login'); // Redirect to the login page after successful registration
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('An error occurred during registration');
      setIsSuccess(false);
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
        {message && (
          <div className={`alert mt-4 ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;