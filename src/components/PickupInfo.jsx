// src/components/PickupInfo.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Table from './Table';
import BackArrow from './BackArrow';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format, startOfDay, endOfDay, subDays, isWithinInterval } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const CustomAlert = ({ show, variant, onClose, children }) => {
  if (!show) return null;

  return (
    <div className={`custom-alert alert-${variant}`}>
      {children}
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
};


const PickupInfo = () => {
  const [receipts, setReceipts] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [dateSearchTerm, setDateSearchTerm] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showClientAlert, setShowClientAlert] = useState(false);
  const [showDateAlert, setShowDateAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPickupInfo();
  }, []);

  const fetchPickupInfo = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/pickupInfo`);
      console.log('Pickup Info Response:', response.data);

      const fetchedReceipts = response.data.receipts || [];
      if (!Array.isArray(fetchedReceipts)) {
        console.error('Receipt data is not an array:', fetchedReceipts);
        return;
      }
      setReceipts(fetchedReceipts);
    } catch (error) {
      console.error('Error retrieving pickup information:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const filteredPickups = useMemo(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const todayStart = startOfDay(toZonedTime(now, userTimeZone));
    const todayEnd = endOfDay(toZonedTime(now, userTimeZone));
    const sevenDaysAgo = subDays(todayStart, 7);
    const thirtyDaysAgo = subDays(todayStart, 30);
  
    const filterByInterval = (receipt, start, end) => {
      if (!receipt.pickuptime) return false;
      const pickupTime = toZonedTime(parseISO(receipt.pickuptime), userTimeZone);
      return isWithinInterval(pickupTime, { start, end });
    };
  
    return {
      today: receipts.filter(receipt => filterByInterval(receipt, todayStart, todayEnd)),
      lastSevenDays: receipts.filter(receipt => filterByInterval(receipt, sevenDaysAgo, now)),
      lastThirtyDays: receipts.filter(receipt => filterByInterval(receipt, thirtyDaysAgo, now))
    };
  }, [receipts]);
  
  const formatDateTime = (receipt) => {
    if (!receipt || !receipt.pickuptime) {
      return 'N/A'; // or any default value you prefer
    }
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(parseISO(receipt.pickuptime), userTimeZone, 'MMMM d, yyyy h:mm a');
  };
  
  

  const handleClientSearch = async () => {
    if (!clientSearchTerm.trim()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchPickups?term=${encodeURIComponent(clientSearchTerm)}`);
      const results = response.data.receipts || [];
      setSearchResults(results);
      setShowClientAlert(results.length === 0);
      setShowDateAlert(false);
    } catch (error) {
      console.error('Error searching pickups by client:', error);
      setShowClientAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSearch = async (selectedDate = dateSearchTerm) => {
    if (!selectedDate) return;
    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchPickups`, {
        params: {
          date: formattedDate,
          timeZone: timeZone
        }
      });
      const results = response.data.receipts || [];
      setSearchResults(results);
      setShowDateAlert(results.length === 0);
      setShowClientAlert(false);
    } catch (error) {
      console.error('Error searching pickups by date:', error);
      setShowDateAlert(true);
    } finally {
      setIsLoading(false);
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
              
              { header: 'Pickup Time', field: 'pickuptime' },
              { header: 'Created By', field: 'createdby' },
            ]}
            data={data.map((receipt) => ({
              ...receipt,
              pickuptime: receipt.pickuptime ? formatDateTime(receipt) : 'N/A',
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
                    <h5 className="card-title"><strong>Search by Term</strong></h5>
                    <p className="card-text">Returns the most recent pickup for a client (search by name or location) or the most recent pickups by a specfic employee (search by name)</p>
                    <div className="search-container">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter search term" 
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
                <CustomAlert 
                  show={showClientAlert} 
                  variant="info" 
                  onClose={() => setShowClientAlert(false)}
                >
                  No results found for this client. Try a different client name or location, or use the date search instead.
                </CustomAlert>
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
                          handleDateSearch(date);
                        }}
                        className="form-control"
                        placeholderText="Select a date"
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
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
                <CustomAlert 
                  show={showDateAlert} 
                  variant="info" 
                  onClose={() => setShowDateAlert(false)}
                >
                  No pickups found for this date. Try selecting a different date or use the client search instead.
                </CustomAlert>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : searchResults.length > 0 ? (
          renderTable(searchResults, "Search Results")
        ) : (
          <>
            {renderTable(filteredPickups.today, "Today")}
            {renderTable(filteredPickups.lastSevenDays, "Last 7 Days")}
            {renderTable(filteredPickups.lastThirtyDays, "Last 30 Days")}
          </>
        )}
      </div>
    </div>
  );
};

export default PickupInfo;