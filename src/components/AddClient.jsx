// src/components/AddClient.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import BackArrow from './BackArrow';

const AddClient = () => {
  const [client, setClient] = useState({
    clientname: '',
    clientlocation: '',
    clienttype: 'auto',
    avgtimebetweenpickups: '',
    locationnotes: '',
    locationcontact: '',
    paymentmethod: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = token ? jwtDecode(token).userType === 'admin' : false;

  if (!isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/addClient`, client);
      setMessage(response.data.message);
      if (response.data.success) {
        setTimeout(() => navigate('/clientList'), 2000);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      setMessage('Error adding client. Please try again.');
    }
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/clientList">Client List</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <BackArrow />
        <div className="card">
          <div className="card-header text-center">
            <h5>Add New Client</h5>
          </div>
          <div className="card-body">
            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="clientname">Client Name:</label>
                <input type="text" className="form-control" id="clientname" name="clientname" value={client.clientname} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="clientlocation">Client Location:</label>
                <input type="text" className="form-control" id="clientlocation" name="clientlocation" value={client.clientlocation} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="clienttype">Client Type:</label>
                <select className="form-control" id="clienttype" name="clienttype" value={client.clienttype} onChange={handleInputChange} required>
                  <option value="auto">Auto</option>
                  <option value="hvac">HVAC</option>
                  <option value="insulation">Insulation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="avgtimebetweenpickups">Average Time Between Pickups (days):</label>
                <input type="number" className="form-control" id="avgtimebetweenpickups" name="avgtimebetweenpickups" value={client.avgtimebetweenpickups} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="locationnotes">Location Notes:</label>
                <textarea className="form-control" id="locationnotes" name="locationnotes" value={client.locationnotes} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="locationcontact">Location Contact:</label>
                <input type="text" className="form-control" id="locationcontact" name="locationcontact" value={client.locationcontact} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="paymentmethod">Payment Method:</label>
                <select 
                  className="form-control" 
                  id="paymentmethod" 
                  name="paymentmethod" 
                  value={client.paymentmethod} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="Direct Deposit">Direct Deposit</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Add Client</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClient;