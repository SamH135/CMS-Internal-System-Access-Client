import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import BackArrow from './BackArrow';
import { formatDate, formatTime } from '../dateUtils';

const ViewLoads = () => {
  const [truckLoads, setTruckLoads] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchTruckLoads();
  }, [date]);

  const fetchTruckLoads = async () => {
    try {
      const response = await axiosInstance.get(`/api/truckLoads?date=${date}`);
      setTruckLoads(response.data.truckLoads);
    } catch (error) {
      console.error('Error fetching truck loads:', error);
    }
  };

  return (
    <div>
      <nav>
        <h4>Truck Load Management</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <BackArrow />
        <h2>View Truck Loads</h2>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Select Date:</label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {truckLoads.map((truck, index) => (
          <div key={index} className="card mb-3">
            <div className="card-header">
              <h5>Truck {index + 1} - {truck.createdby}</h5>
            </div>
            <div className="card-body">
              <p>Total Weight: {truck.totalWeight.toFixed(2)} lbs</p>
              <h6>Metal Breakdown:</h6>
              <ul>
                {Object.entries(truck.metals).map(([metal, weight]) => (
                  <li key={metal}>{metal}: {parseFloat(weight).toFixed(2)} lbs</li>
                ))}
              </ul>
              <p>Last Receipt: {formatDate(truck.lastReceiptDate)} at {formatTime(truck.lastReceiptTime)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewLoads;