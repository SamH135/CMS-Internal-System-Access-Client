import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';

const EditUser = () => {
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { userID } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/editUser/${userID}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error retrieving user:', error);
      }
    };
  
    if (token && jwtDecode(token).userType === 'admin') {
      fetchUser();
    } else {
      navigate('/dashboard');
    }
  }, [userID, token, navigate]);
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateUser`, {
        userid: user.userid,
        username: user.username,
        usertype: user.usertype,
      });
      setSuccessMessage('User updated successfully');
      setTimeout(() => {
        navigate('/userDashboard');
      }, 2000);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>Edit User</strong>
          </div>
          <div className="card-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleUpdateUser}>
              <input type="hidden" name="userID" value={user.userid} />
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" name="username" id="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="userType">User Type:</label>
                <select className="form-control" name="userType" id="userType" value={user.usertype} onChange={(e) => setUser({ ...user, usertype: e.target.value })} required>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Update User</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;