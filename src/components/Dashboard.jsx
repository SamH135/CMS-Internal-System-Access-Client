import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';

const Dashboard = () => {
  const userType = useSelector((state) => state.auth.userType);
  

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Logout /></li>
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
            {userType === 'admin' && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;