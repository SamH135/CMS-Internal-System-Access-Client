// src/components/ViewPrices.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import BackArrow from './BackArrow';

const ViewPrices = () => {
  const [prices, setPrices] = useState({ hvacPrices: {}, autoPrices: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axiosInstance.get('/api/view-prices');
        setPrices(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prices:', err);
        setError('Failed to load prices. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const renderPriceTable = (priceData, title) => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>{title}</h5>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(priceData).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>${parseFloat(value).toFixed(2)} /lb</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <div>Loading prices...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

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
        <h2 className="text-center mb-4">Current Prices</h2>
        {renderPriceTable(prices.hvacPrices, 'HVAC Prices')}
        {renderPriceTable(prices.autoPrices, 'Auto Prices')}
      </div>
    </div>
  );
};

export default ViewPrices;