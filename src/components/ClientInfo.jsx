import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientInfo = () => {
  const [client, setClient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { clientID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const response = await axios.get(`/auth/clientInfo/${clientID}`);
        setClient(response.data.client);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Error retrieving client:', error);
      }
    };

    fetchClientInfo();
  }, [clientID]);

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/updateClient', {
        clientID: client.ClientID,
        clientName: client.ClientName,
        clientLocation: client.ClientLocation,
      });
      // Handle successful update, e.g., show a success message
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
          <li><button onClick={() => navigate.push('/auth/logout')}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>Client Information</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateClient}>
              <input type="hidden" name="clientID" value={client.ClientID} />
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
              {/* Add more form fields for other client data */}
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