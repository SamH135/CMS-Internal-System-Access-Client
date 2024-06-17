// src/components/ClientList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';

const ClientList = () => {
  const token = useSelector((state) => state.auth.token);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchClients();
    }
  }, [token, navigate]);

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/clientList`);
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error retrieving clients:', error);
    }
  };
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchClients?term=${encodeURIComponent(searchTerm)}`);
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  const handleClientClick = (clientid) => {
    navigate(`/clientInfo/${clientid}`);
  };

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
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.clientid} onClick={() => handleClientClick(client.clientid)}>
                    <td>{client.clientid}</td>
                    <td>{client.clientname}</td>
                    <td>{client.clientlocation}</td>
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