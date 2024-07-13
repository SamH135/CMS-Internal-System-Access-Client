import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import BackArrow from './BackArrow';

const EditUser = () => {
  const [user, setUser] = useState({ userid: '', username: '', usertype: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { userID } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/editUser/${userID}`);
        console.log('API Response:', response.data);
        if (response.data && response.data.user) {
          setUser({
            userid: response.data.user.userid?.toString() ?? '',
            username: response.data.user.username ?? '',
            usertype: response.data.user.usertype ?? ''
          });
        } else {
          console.error('Unexpected data format:', response.data);
          setErrorMessage('Failed to load user data');
        }
      } catch (error) {
        console.error('Error retrieving user:', error);
        setErrorMessage('Failed to load user data');
      }
      setLoading(false);
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
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateUser`, {
        userid: user.userid,
        username: user.username,
        usertype: user.usertype
      });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setSuccessMessage('User updated successfully');
        setTimeout(() => {
          navigate('/userDashboard');
        }, 2000);
      } else {
        setErrorMessage('Failed to update user. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Failed to update user. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log('Current user state:', user);

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
        <BackArrow />
        <div className="card">
          <div className="card-header text-center">
            <strong>Edit User</strong>
          </div>
          <div className="card-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label htmlFor="userid">User ID:</label>
                <input type="text" className="form-control" name="userid" id="userid" value={user.userid} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" name="username" id="username" value={user.username} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="usertype">User Type:</label>
                <select className="form-control" name="usertype" id="usertype" value={user.usertype} onChange={handleInputChange} required>
                  <option value="admin">Admin</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Update User</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;