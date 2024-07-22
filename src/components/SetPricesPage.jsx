// src/components/SetPricesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BackArrow from './BackArrow';

const SetPricesPage = () => {
  return (
    <div className="container mt-4">
      <BackArrow />
      <h2 className="text-center mb-4">Set Prices</h2>
      <div className="row justify-content-center">
        <div className="col-sm-6 mb-4">
          <Link to="/set-hvac-prices" className="card-link">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Set HVAC Prices</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-sm-6 mb-4">
          <Link to="/set-auto-prices" className="card-link">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Set Auto Prices</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SetPricesPage;