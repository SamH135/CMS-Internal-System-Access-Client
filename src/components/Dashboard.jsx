import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import RequestList from './RequestList';


const Dashboard = () => {
  const userType = useSelector((state) => state.auth.userType);


  const menuItems = [
    {
      to: "/clientList",
      title: "Clients",
      description: "View and manage client information",
      icon: "/client_list_button_icon.png",
      alt: "Client icon",
    },
    {
      to: "/pickupInfo",
      title: "Routes",
      description: "View recent shop pickups",
      icon: "/route_info_button_icon.png",
      alt: "Route icon",
    },
    {
      to: "/userDashboard",
      title: "Users",
      description: "Manage system users",
      icon: "/manage_accounts_button_icon.png",
      alt: "Manage accounts icon",
      adminOnly: true,
    },
    {
      to: "/set-prices",
      title: "Set Prices",
      description: "Update pricing for auto/hvac metals",
      icon: "/set_prices_icon.png",
      alt: "Set Prices icon",
      adminOnly: true,
    },
    {
      to: "/receiptList",
      title: "Receipts",
      description: "View and search receipts",
      icon: "/receipt_log_button_icon.png",
      alt: "Receipt log icon",
    },
    {
      to: "/view-prices",
      title: "Prices",
      description: "View current metal prices",
      icon: "/view_prices_icon.png",
      alt: "View Prices icon",
      regularOnly: true,
    },
    {
      to: "/view-loads",
      title: "Truck Loads",
      description: "View load (lbs) on each truck",
      icon: "/load_weight.png",
      alt: "load icon",
    },
    {
      to: "/generate-csv",
      title: "Generate CSV",
      description: "Download a CSV file for QuickBooks",
      icon: "/csv_icon.png",
      alt: "CSV icon",
      adminOnly: true,
    },
  ];


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
              {menuItems.map((item, index) => (
                ((item.adminOnly && userType === 'admin') ||
                 (item.regularOnly && userType === 'regular') ||
                 (!item.adminOnly && !item.regularOnly)) && (
                  <div className="col-sm-6 mb-4" key={index}>
                    <Link to={item.to} className="card-link">
                      <div className="card inner-card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title mb-0">{item.title}</h5>
                            <img src={item.icon} alt={item.alt} className="card-icon" />
                          </div>
                          <p className="card-text text-muted">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              ))}
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

