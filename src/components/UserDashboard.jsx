import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import Table from './Table';
import BackArrow from './BackArrow';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserID, setCurrentUserID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token && jwtDecode(token).userType === 'admin') {
      fetchUsers();
    } else {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/userDashboard`);
      setUsers(response.data.users);
      setCurrentUserID(response.data.currentUserID);
    } catch (error) {
      console.error('Error retrieving users:', error);
    }
  };
  
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
      <BackArrow />
        <div className="card">
          <div className="card-header text-center d-flex justify-content-center align-items-center">
            <img src="/manage_accounts_button_icon.png" alt="User dashboard icon" className="card-icon me-2" />
            <strong>User Dashboard</strong>
          </div>
          <div className="card-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="search-container">
              <input 
                type="text" 
                id="searchInput" 
                className="form-control" 
                placeholder="Search by username or ID" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              />
              <img 
                src="/search_button_icon.png" 
                alt="Search" 
                className={`search-icon ${searchTerm ? 'hidden' : ''}`}
                onClick={handleSearch}
              />
              <img 
                src="/close_button_icon.png" 
                alt="Clear" 
                className={`clear-icon ${searchTerm ? '' : 'hidden'}`}
                onClick={() => {
                  setSearchTerm('');
                  fetchUsers();
                }}
              />
            </div>
            <Table
              columns={[
                { header: 'User ID', field: 'userid' },
                { header: 'Username', field: 'username' },
                { header: 'User Type', field: 'usertype' },
                { header: 'Actions', field: 'actions' },
              ]}
              data={users.map((user) => ({
                ...user,
                actions: (
                  <>
                    <button type="button" className="btn btn-primary" onClick={() => handleEditUser(user.userid)}>Edit</button>
                    {user.userid !== currentUserID && (
                      <button type="button" className="btn btn-danger" onClick={() => handleDeleteUser(user.userid)}>Delete</button>
                    )}
                  </>
                ),
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;