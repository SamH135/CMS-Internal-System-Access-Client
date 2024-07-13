import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import Table from './Table';
import BackArrow from './BackArrow';

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
      <BackArrow />
        <div className="card">
          
          <div className="card-header text-center d-flex justify-content-center align-items-center">
            <img src="/client_list_button_icon.png" alt="Client icon" className="card-icon me-2" />
            <strong>Client List</strong>
          </div>
          <div className="card-body">
            <div className="search-container">
              <input 
                type="text" 
                id="searchInput" 
                className="form-control" 
                placeholder="Search by client name, ID, or location" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              />
              <img 
                src="/search_button_icon.png" 
                alt="Search" 
                className={`search-icon ${searchTerm ? 'hidden' : ''}`}
                onClick={handleSearch}
              />
              <img 
                src="/close_button_icon.png" 
                alt="Clear" 
                className={`clear-icon ${searchTerm ? '' : 'hidden'}`}
                onClick={() => {
                  setSearchTerm('');
                  fetchClients();
                }}
              />
            </div>
            <Table
              columns={[
                { header: 'Client ID', field: 'clientid' },
                { header: 'Client Name', field: 'clientname' },
                { header: 'Location', field: 'clientlocation' },
              ]}
              data={clients}
              onRowClick={(client) => handleClientClick(client.clientid)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;