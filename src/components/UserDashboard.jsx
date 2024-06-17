import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';


const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserID, setCurrentUserID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/userDashboard`);
        setUsers(response.data.users);
        setCurrentUserID(response.data.currentUserID);
      } catch (error) {
        console.error('Error retrieving users:', error);
      }
    };
  
    if (token && jwtDecode(token).userType === 'admin') {
      fetchUsers();
    } else {
      navigate('/dashboard');
    }
  }, [token, navigate]);
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchUsers?term=${encodeURIComponent(searchTerm)}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  
  const handleDeleteUser = async (userID) => {
    try {
      const isCurrentUser = userID === currentUserID;
  
      if (isCurrentUser) {
        alert("You cannot delete your own user account.");
        return;
      }
  
      await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/api/deleteUser/${userID}`);
      setUsers(users.filter((user) => user.userid !== userID));
      setSuccessMessage('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (userID) => {
    navigate(`/editUser/${userID}`);
  };

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
            <strong>User Dashboard</strong>
          </div>
          <div className="card-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="form-group">
              <input type="text" className="form-control" id="searchInput" placeholder="Search by username or ID" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="button" className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userid}>
                    <td>{user.userid}</td>
                    <td>{user.username}</td>
                    <td>{user.usertype}</td>
                    <td>
                      <button type="button" className="btn btn-primary" onClick={() => handleEditUser(user.userid)}>Edit</button>
                      {user.userid !== currentUserID && (
                        <button type="button" className="btn btn-danger" onClick={() => handleDeleteUser(user.userid)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;