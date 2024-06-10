import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/auth/clientList');
        setClients(response.data.clients);
      } catch (error) {
        console.error('Error retrieving clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/auth/searchClients?term=${encodeURIComponent(searchTerm)}`);
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  const handleClientClick = (clientID) => {
    navigate.push(`/clientInfo/${clientID}`);
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><button onClick={() => navigate.push('/auth/logout')}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>Client List</strong>
          </div>
          <div className="card-body">
            <div className="form-group">
              <input type="text" className="form-control" id="searchInput" placeholder="Search by client name, ID, or location" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="button" className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Client Name</th>
                  <th>Location</th>
                  {/* Add more table headers as needed */}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.ClientID} onClick={() => handleClientClick(client.ClientID)}>
                    <td>{client.ClientID}</td>
                    <td>{client.ClientName}</td>
                    <td>{client.ClientLocation}</td>
                    {/* Add more table cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;