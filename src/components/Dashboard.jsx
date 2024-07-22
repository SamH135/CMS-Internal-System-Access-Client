import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import RequestList from './RequestList';

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
        <div className="card outer-card mb-4">
          <div className="card-header text-center">
            Signed in with permission level: <br></br> {userType}
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 mb-4">
                <Link to="/clientList" className="card-link">
                  <div className="card inner-card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Clients</h5>
                      <img src="/client_list_button_icon.png" alt="Client icon" className="card-icon" />
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-sm-6 mb-4">
                <Link to="/pickupInfo" className="card-link">
                  <div className="card inner-card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Routes</h5>
                      <img src="/route_info_button_icon.png" alt="Route icon" className="card-icon" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="row">
              {userType === 'admin' && (
                <div className="col-sm-6 mb-4">
                  <Link to="/userDashboard" className="card-link">
                    <div className="card inner-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Users</h5>
                        <img src="/manage_accounts_button_icon.png" alt="Manage accounts icon" className="card-icon" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {userType === 'admin' && (
                <div className="col-sm-6 mb-4">
                  <Link to="/set-prices" className="card-link">
                    <div className="card inner-card">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">Set Prices</h5>
                        <img src="/set_prices_icon.png" alt="Set Prices icon" className="card-icon" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              <div className="col-sm-6 mb-4">
                <Link to="/receiptList" className="card-link">
                  <div className="card inner-card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Receipts</h5>
                      <img src="/receipt_log_button_icon.png" alt="Receipt log icon" className="card-icon" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded RequestList */}
        <div className="card outer-card">
          <div className="card-header text-center">
            <h5>Recent Requests</h5>
          </div>
          <div className="card-body">
            <RequestList embedded={true} />
          </div>
        </div>
      </div>
      <style>
        {`
          .card-icon {
            width: 48px;
            height: 48px;
            filter: brightness(0.5);
          }
          .card-link {
            text-decoration: none;
            color: inherit;
          }
          .card-link:hover {
            text-decoration: none;
          }
          .inner-card {
            transition: all 0.3s ease;
          }
          .inner-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;