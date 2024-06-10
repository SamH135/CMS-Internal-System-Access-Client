import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = () => {
  const [user, setUser] = useState(null);
  const { userID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/auth/editUser/${userID}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error retrieving user:', error);
      }
    };

    fetchUser();
  }, [userID]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/updateUser', {
        userID: user.UserID,
        username: user.Username,
        userType: user.UserType,
      });
      // Handle successful update, e.g., redirect to user dashboard
      navigate.push('/userDashboard');
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
          <li><button onClick={() => navigate.push('/auth/logout')}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>Edit User</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateUser}>
              <input type="hidden" name="userID" value={user.UserID} />
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" name="username" id="username" value={user.Username} onChange={(e) => setUser({ ...user, Username: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="userType">User Type:</label>
                <select className="form-control" name="userType" id="userType" value={user.UserType} onChange={(e) => setUser({ ...user, UserType: e.target.value })} required>
                  <option value="admin">Admin</option>
                  <option value="regular">User</option>
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