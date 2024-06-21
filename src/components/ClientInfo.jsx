import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';

const ClientInfo = () => {
  const [client, setClient] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { clientID } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = token ? jwtDecode(token).userType === 'admin' : false;

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/clientInfo/${clientID}`);
        setClient(response.data.client);
      } catch (error) {
        console.error('Error retrieving client:', error);
      }
    };

    if (token) {
      fetchClientInfo();
    } else {
      navigate('/login');
    }
  }, [clientID, token, navigate]);

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      const updatedClient = {
        ...client,
        avgtimebetweenpickups: parseInt(client.avgtimebetweenpickups),
        totalpayout: parseFloat(client.totalpayout),
        totalvolume: parseFloat(client.totalvolume),
        needspickup: Boolean(client.needspickup)
      };
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateClient`, updatedClient);
      setSuccessMessage('Client updated successfully');
      // Refresh client data
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/clientInfo/${clientID}`);
      setClient(response.data.client);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!client) {
    return <div>Loading...</div>;
  }

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
        <div className="card">
        <div className="card-header text-center d-flex justify-content-center align-items-center">
          <img src="/list_button_icon.png" alt="Client info icon" className="card-icon me-2" />
          <strong>Client Information</strong>
        </div>
          <div className="card-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleUpdateClient}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="clientid">Client ID:</label>
                    <input type="text" className="form-control" name="clientid" id="clientid" value={client.clientid} readOnly />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clientname">Client Name:</label>
                    <input type="text" className="form-control" name="clientname" id="clientname" value={client.clientname || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clientlocation">Client Location:</label>
                    <input type="text" className="form-control" name="clientlocation" id="clientlocation" value={client.clientlocation || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clienttype">Client Type:</label>
                    <select className="form-control" name="clienttype" id="clienttype" value={client.clienttype || ''} onChange={handleInputChange} disabled={!isAdmin}>
                      <option value="auto">Auto</option>
                      <option value="hvac">HVAC</option>
                      <option value="insulation">Insulation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="avgtimebetweenpickups">Average Time Between Pickups:</label>
                    <input type="number" className="form-control" name="avgtimebetweenpickups" id="avgtimebetweenpickups" value={client.avgtimebetweenpickups || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="locationnotes">Location Notes:</label>
                    <textarea className="form-control" name="locationnotes" id="locationnotes" value={client.locationnotes || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="registrationdate">Registration Date:</label>
                    <input type="date" className="form-control" name="registrationdate" id="registrationdate" value={client.registrationdate ? client.registrationdate.split('T')[0] : ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="locationcontact">Location Contact:</label>
                    <input type="text" className="form-control" name="locationcontact" id="locationcontact" value={client.locationcontact || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="totalpayout">Total Payout:</label>
                    <input type="number" step="0.01" className="form-control" name="totalpayout" id="totalpayout" value={client.totalpayout || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="totalvolume">Total Volume:</label>
                    <input type="number" step="0.01" className="form-control" name="totalvolume" id="totalvolume" value={client.totalvolume || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="paymentmethod">Payment Method:</label>
                    <input type="text" className="form-control" name="paymentmethod" id="paymentmethod" value={client.paymentmethod || ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastpickupdate">Last Pickup Date:</label>
                    <input type="date" className="form-control" name="lastpickupdate" id="lastpickupdate" value={client.lastpickupdate ? client.lastpickupdate.split('T')[0] : ''} onChange={handleInputChange} readOnly={!isAdmin} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="needspickup">Needs Pickup:</label>
                    <input type="checkbox" className="form-control" name="needspickup" id="needspickup" checked={client.needspickup || false} onChange={handleInputChange} disabled={!isAdmin} />
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;