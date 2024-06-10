import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('/auth/dashboard');
        setUserType(response.data.userType);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        navigate.push('/login');
      }
    };

    fetchUserType();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout');
      // Handle successful logout, e.g., redirect to index
      navigate.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>Welcome, {userType}!</strong>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Client List</h5>
                    <p className="card-text">View and search client list.</p>
                    <Link to="/clientList" className="btn btn-primary">Go to Client List</Link>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Pickup Information</h5>
                    <p className="card-text">View and manage pickup details.</p>
                    <Link to="/pickupInfo" className="btn btn-primary">Go to Pickup Info</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">User Dashboard</h5>
                    <p className="card-text">Manage system users.</p>
                    <Link to="/userDashboard" className="btn btn-primary">Go to User Dashboard</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;