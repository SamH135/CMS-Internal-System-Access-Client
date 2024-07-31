import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Table from './Table';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';


const RequestList = () => {
  const token = useSelector((state) => state.auth.token);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const navigate = useNavigate();
  const isAdmin = token ? jwtDecode(token).userType === 'admin' : false;

  const fetchRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/requests?sortOrder=${sortOrder}&searchTerm=${encodeURIComponent(searchTerm)}`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error retrieving requests:', error);
    }
  }, [sortOrder, searchTerm]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchRequests();
    }
  }, [token, navigate, fetchRequests]);

  const handleSearch = () => {
    fetchRequests();
  };

  const handleDeleteSelectedRequests = async () => {
    if (selectedRequests.length === 0) {
      alert("No requests selected");
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${selectedRequests.length} selected request(s)? \nNOTE: requests are deleted automatically when a new receipt is made for that client.`)) {
      try {
        await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/api/deleteRequests`, {
          data: { requestIDs: selectedRequests }
        });
        setSelectedRequests([]);
        fetchRequests();
      } catch (error) {
        console.error('Error deleting selected requests:', error);
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSelectRequest = useCallback((requestID) => {
    setSelectedRequests(prev => 
      prev.includes(requestID) 
        ? prev.filter(id => id !== requestID)
        : [...prev, requestID]
    );
  }, []);

  const formatDate = (dateString) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(parseISO(dateString), userTimeZone, 'MMMM d, yyyy');
  };

  const columns = [
    ...(isAdmin ? [{
      header: 'Select',
      field: 'select',
      render: (value, request) => (
        <div style={{ padding: '10px' }}>
          <input 
            type="checkbox" 
            checked={selectedRequests.includes(request.requestid)}
            onChange={() => handleSelectRequest(request.requestid)}
            style={{ 
              width: '20px', 
              height: '20px',
              cursor: 'pointer'
            }}
          />
        </div>
      ),
    }] : []),
    { header: 'Client Name', field: 'clientname' },
    { header: 'Request Date', field: 'requestdate' }
  ];

  const handleRowClick = useCallback((row, e) => {
    // Check if the click is on the checkbox or its container
    if (!e.target.closest('td:first-child')) {
      navigate(`/requestInfo/${row.requestid}`);
    }
  }, [navigate]);


  return (
    <div>
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            <div className="search-container">
              <input 
                type="text" 
                id="searchInput" 
                className="form-control" 
                placeholder="Search by client name, ID, or request ID" 
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
                  fetchRequests();
                }}
              />
            </div>
            <div className="d-flex justify-content-between mb-2">
              <button className="btn btn-secondary" onClick={toggleSortOrder}>
                Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
              {isAdmin && (
                <button 
                  className="btn btn-danger" 
                  onClick={handleDeleteSelectedRequests}
                  disabled={selectedRequests.length === 0}
                >
                  Delete Selected ({selectedRequests.length})
                </button>
              )}
            </div>
            <Table
              columns={columns}
              data={requests.map(request => ({
                ...request,
                requestdate: formatDate(request.requestdate)
              }))}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestList;