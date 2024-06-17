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
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateClient`, {
        clientID: client.ClientID,
        clientName: client.ClientName,
        clientLocation: client.ClientLocation,
      });
      setSuccessMessage('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
    }
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
          <div className="card-header text-center">
            <strong>Client Information</strong>
          </div>
          <div className="card-body">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleUpdateClient}>
              <div className="form-group">
                <label htmlFor="clientName">Client Name:</label>
                <input type="text" className="form-control" name="clientName" id="clientName" value={client.ClientName} onChange={(e) => setClient({ ...client, ClientName: e.target.value })} readOnly={!isAdmin} />
              </div>
              <div className="form-group">
                <label htmlFor="clientLocation">Client Location:</label>
                <input type="text" className="form-control" name="clientLocation" id="clientLocation" value={client.ClientLocation} onChange={(e) => setClient({ ...client, ClientLocation: e.target.value })} readOnly={!isAdmin} />
              </div>
              <div className="form-group">
                <label htmlFor="clientType">Client Type:</label>
                <input type="text" className="form-control" name="clientType" id="clientType" value={client.ClientType} onChange={(e) => setClient({ ...client, ClientType: e.target.value })} readOnly={!isAdmin} />
              </div>
              {isAdmin && (
                <button type="submit" className="btn btn-primary">Save Changes</button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;