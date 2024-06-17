import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const PickupInfo = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPickupInfo = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/pickupInfo`);
        setClients(response.data.clients);
      } catch (error) {
        console.error('Error retrieving pickup information:', error);
      }
    };
  
    fetchPickupInfo();
  }, []);
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchClients?term=${encodeURIComponent(searchTerm)}`);
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><button onClick={() => navigate('/logout')}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header text-center">
            <strong>Pickup Information</strong>
          </div>
          <div className="card-body">
            <div className="form-group">
              <input type="text" className="form-control" id="searchInput" placeholder="Search by client name or location" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button type="button" className="btn btn-primary mt-2" onClick={handleSearch}>Search</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Location</th>
                  <th>Last Pickup Date</th>
                  <th>Needs Pickup</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.clientid}>
                    <td>{client.clientname}</td>
                    <td>{client.clientlocation}</td>
                    <td>{client.lastpickupdate}</td>
                    <td>{client.needspickup ? 'Yes' : 'No'}</td>
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

export default PickupInfo;