import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUserID, setCurrentUserID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/auth/userDashboard');
        setUsers(response.data.users);
        setCurrentUserID(response.data.currentUserID);
      } catch (error) {
        console.error('Error retrieving users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/auth/searchUsers?term=${encodeURIComponent(searchTerm)}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleEditUser = (userID) => {
    navigate.push(`/editUser/${userID}`);
  };

  const handleDeleteUser = async (userID) => {
    try {
      await axios.delete(`/auth/deleteUser/${userID}`);
      // Handle successful deletion, e.g., refresh user list
      setUsers(users.filter((user) => user.UserID !== userID));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><button onClick={() => navigate.push('/auth/logout')}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>User Dashboard</strong>
          </div>
          <div className="card-body">
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
                  <tr key={user.UserID}>
                    <td>{user.UserID}</td>
                    <td>{user.Username}</td>
                    <td>{user.UserType}</td>
                    <td>
                      <button type="button" className="btn btn-primary" onClick={() => handleEditUser(user.UserID)}>Edit</button>
                      {user.UserID !== currentUserID && (
                        <button type="button" className="btn btn-danger" onClick={() => handleDeleteUser(user.UserID)}>Delete</button>
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