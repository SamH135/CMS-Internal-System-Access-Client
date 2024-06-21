import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Table from './Table';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
  
  const handleSearch = async (e) => {
    e.preventDefault();
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
        <div className="card-header text-center d-flex justify-content-center align-items-center">
          <img src="/route_info_button_icon.png" alt="Pickup info icon" className="card-icon me-2" />
          <strong>Pickup Information</strong>
        </div>
          <div className="card-body">
            <br></br>
            <form onSubmit={handleSearch}>
              <div className="form-group">
                <input type="text" className="form-control" id="searchInput" placeholder="Search by client name or location" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary mt-2">Search</button>
            </form>
            <br></br>
            <br></br>
            <Table
              columns={[
                { header: 'Client Name', field: 'clientname' },
                { header: 'Location', field: 'clientlocation' },
                { header: 'Last Pickup Date', field: 'lastpickupdate' },
                { header: 'Needs Pickup', field: 'needspickup' },
              ]}
              data={clients.map((client) => ({
                ...client,
                lastpickupdate: formatDate(client.lastpickupdate),
                needspickup: client.needspickup ? 'Yes' : 'No',
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupInfo;