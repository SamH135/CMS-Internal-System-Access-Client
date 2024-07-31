// src/components/PickupInfo.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Table from './Table';
import BackArrow from './BackArrow';
import { Alert } from 'react-bootstrap';
import { formatDate, formatTime, getStartOfWeek, getEndOfWeek } from '../dateUtils';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const PickupInfo = () => {
  const [pickupsToday, setPickupsToday] = useState([]);
  const [pickupsThisWeek, setPickupsThisWeek] = useState([]);
  const [pickupsThisMonth, setPickupsThisMonth] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [dateSearchTerm, setDateSearchTerm] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showClientAlert, setShowClientAlert] = useState(false);
  const [showDateAlert, setShowDateAlert] = useState(false);
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
      today.setHours(0, 0, 0, 0);  // Use local time instead of UTC
      
      const startOfWeek = getStartOfWeek(today);
      const endOfWeek = getEndOfWeek(today);
  
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
      setPickupsToday(receipts.filter(receipt => {
        const pickupDate = new Date(receipt.pickupdate);
        pickupDate.setHours(0, 0, 0, 0);  // Use local time for comparison
        return pickupDate.getTime() === today.getTime();
      }));
  
      setPickupsThisWeek(receipts.filter(receipt => {
        const pickupDate = new Date(receipt.pickupdate);
        return pickupDate >= startOfWeek && pickupDate <= endOfWeek;
      }));
  
      setPickupsThisMonth(receipts.filter(receipt => {
        const pickupDate = new Date(receipt.pickupdate);
        return pickupDate >= startOfMonth && pickupDate <= endOfMonth;
      }));
    } catch (error) {
      console.error('Error retrieving pickup information:', error);
    }
  };
  
  const handleClientSearch = async () => {
    if (!clientSearchTerm.trim()) return;
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchPickups?term=${encodeURIComponent(clientSearchTerm)}`);
      const results = response.data.receipts || [];
      setSearchResults(results);
      setShowClientAlert(results.length === 0);
      setShowDateAlert(false);
    } catch (error) {
      console.error('Error searching pickups by client:', error);
      setShowClientAlert(true);
    }
  };
  
  const handleDateSearch = async (selectedDate = dateSearchTerm) => {
    if (!selectedDate) return;
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchPickups?date=${formattedDate}`);
      const results = response.data.receipts || [];
      setSearchResults(results);
      setShowDateAlert(results.length === 0);
      setShowClientAlert(false);
    } catch (error) {
      console.error('Error searching pickups by date:', error);
      setShowDateAlert(true);
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
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title"><strong>Search by Client</strong></h5>
                    <p className="card-text">Returns the most recent pickup for a client.</p>
                    <div className="search-container">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter client name or location" 
                        value={clientSearchTerm} 
                        onChange={(e) => setClientSearchTerm(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && handleClientSearch()}
                      />
                      <img 
                        src="/search_button_icon.png" 
                        alt="Search" 
                        className={`search-icon ${clientSearchTerm ? 'hidden' : ''}`}
                        onClick={handleClientSearch}
                      />
                      <img 
                        src="/close_button_icon.png" 
                        alt="Clear" 
                        className={`clear-icon ${clientSearchTerm ? '' : 'hidden'}`}
                        onClick={() => {
                          setClientSearchTerm('');
                          setSearchResults([]);
                          setShowClientAlert(false);
                          fetchPickupInfo();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Alert 
                  show={showClientAlert} 
                  variant="info" 
                  onClose={() => setShowClientAlert(false)} 
                  dismissible
                >
                  No results found for this client. Try a different client name or location, or use the date search instead.
                </Alert>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title"><strong>Search by Date</strong></h5>
                    <p className="card-text">Returns all pickups for a given date.</p>
                    <div className="search-container date-search-container">
                    <DatePicker
                      selected={dateSearchTerm}
                      onChange={(date) => {
                        setDateSearchTerm(date);
                        handleDateSearch(date);  // Call the search function directly when a date is selected
                      }}
                      className="form-control"
                      placeholderText="Select a date"
                      dateFormat="yyyy-MM-dd"
                    />
                      <img 
                        src="/search_button_icon.png" 
                        alt="Search" 
                        className={`search-icon ${dateSearchTerm ? 'hidden' : ''}`}
                        onClick={handleDateSearch}
                      />
                      <img 
                        src="/close_button_icon.png" 
                        alt="Clear" 
                        className={`clear-icon ${dateSearchTerm ? '' : 'hidden'}`}
                        onClick={() => {
                          setDateSearchTerm(null);
                          setSearchResults([]);
                          setShowDateAlert(false);
                          fetchPickupInfo();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <Alert 
                  show={showDateAlert} 
                  variant="info" 
                  onClose={() => setShowDateAlert(false)} 
                  dismissible
                >
                  No pickups found for this date. Try selecting a different date or use the client search instead.
                </Alert>
              </div>
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