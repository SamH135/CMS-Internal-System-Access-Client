// src/components/PickupInfo.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Table from './Table';
import BackArrow from './BackArrow';
import { parseUTCDate, formatDate, formatTime } from '../dateUtils';


const getStartOfWeek = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
};

const getEndOfWeek = (date) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() + (7 - day);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
};

const PickupInfo = () => {
  const [pickupsToday, setPickupsToday] = useState([]);
  const [pickupsThisWeek, setPickupsThisWeek] = useState([]);
  const [pickupsThisMonth, setPickupsThisMonth] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPickupInfo();
  }, []);

  const fetchPickupInfo = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/pickupInfo`);
      console.log('Pickup Info Response:', response.data);

      const receipts = response.data.receipts || [];
      if (!Array.isArray(receipts)) {
        console.error('Receipt data is not an array:', receipts);
        return;
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      
      const startOfWeek = getStartOfWeek(today);
      const endOfWeek = getEndOfWeek(today);

      const startOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
      const endOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));

      setPickupsToday(receipts.filter(receipt => {
        const pickupDate = parseUTCDate(receipt.pickupdate);
        return pickupDate.toUTCString().split('T')[0] === today.toUTCString().split('T')[0];
      }));
      setPickupsThisWeek(receipts.filter(receipt => {
        const pickupDate = parseUTCDate(receipt.pickupdate);
        return pickupDate >= startOfWeek && pickupDate <= endOfWeek;
      }));
      setPickupsThisMonth(receipts.filter(receipt => {
        const pickupDate = parseUTCDate(receipt.pickupdate);
        return pickupDate >= startOfMonth && pickupDate <= endOfMonth;
      }));
    } catch (error) {
      console.error('Error retrieving pickup information:', error);
    }
  };
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchClients?term=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data.clients || []);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  const handleRowClick = (receipt) => {
    navigate(`/receiptInfo/${receipt.receiptid}`);
  };

  const renderTable = (data, title) => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>{title}</h5>
      </div>
      <div className="card-body">
        {data.length > 0 ? (
          <Table
            columns={[
              { header: 'Client Name', field: 'clientname' },
              { header: 'Location', field: 'clientlocation' },
              { header: 'Pickup Date', field: 'pickupdate' },
              { header: 'Pickup Time', field: 'pickuptime' },
              { header: 'Created By', field: 'createdby' },
            ]}
            data={data.map((receipt) => ({
              ...receipt,
              pickupdate: formatDate(receipt.pickupdate),
              pickuptime: formatTime(receipt.pickuptime),
            }))}
            onRowClick={handleRowClick}
          />
        ) : (
          <p className="text-center">No pickups logged {title.toLowerCase()}</p>
        )}
      </div>
    </div>
  );

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
        <BackArrow />
        <div className="card mb-4">
          <div className="card-header text-center d-flex justify-content-center align-items-center">
            <img src="/route_info_button_icon.png" alt="Pickup info icon" className="card-icon me-2" />
            <strong>Pickup Information</strong>
          </div>
          <div className="card-body">
            <div className="search-container">
              <input 
                type="text" 
                id="searchInput" 
                className="form-control" 
                placeholder="Search by client name or location" 
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
                  setSearchResults([]);
                  fetchPickupInfo();
                }}
              />
            </div>
          </div>
        </div>

        {searchResults.length > 0 ? (
          renderTable(searchResults, "Search Results")
        ) : (
          <>
            {renderTable(pickupsToday, "Today")}
            {renderTable(pickupsThisWeek, "This Week")}
            {renderTable(pickupsThisMonth, "This Month")}
          </>
        )}
      </div>
    </div>
  );
};

export default PickupInfo;