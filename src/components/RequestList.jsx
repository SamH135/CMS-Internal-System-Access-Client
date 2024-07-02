import React, { useEffect, useState, useCallback } from 'react';
//import { Link, useNavigate } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
// import Logout from './Logout';
import Table from './Table';

const RequestList = () => {
  const token = useSelector((state) => state.auth.token);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const isAdmin = token ? jwtDecode(token).userType === 'admin' : false;

  const fetchRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/requests?sortOrder=${sortOrder}`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error retrieving requests:', error);
    }
  }, [sortOrder]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchRequests();
    }
  }, [token, navigate, fetchRequests]);
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/requests?searchTerm=${encodeURIComponent(searchTerm)}&sortOrder=${sortOrder}`);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error searching requests:', error);
    }
  };

  const handleDeleteRequest = async (requestID) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/api/requests?searchTerm=${requestID}`);
        fetchRequests(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      {/* <nav>
        <h4>Request Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav> */}

      <div className="container mt-4">
        <div className="card">
          {/* <div className="card-header text-center d-flex justify-content-center align-items-center">
            <img src="/request_list_icon.png" alt="Request icon" className="card-icon me-2" />
            <strong>Request List</strong>
          </div> */}
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
            <div className="d-flex justify-content-end mb-2">
              <button className="btn btn-secondary" onClick={toggleSortOrder}>
                Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <Table
              columns={[
                { header: 'Request ID', field: 'requestid' },
                { header: 'Client Name', field: 'clientname' },
                { header: 'Request Date', field: 'requestdate', render: (date) => new Date(date).toLocaleDateString() },
                { header: 'Number of Barrels', field: 'numfullbarrels' },
                { header: 'Actions', field: 'actions', render: (_, request) => (
                  isAdmin && (
                    <img 
                      src="/close_button_icon.png" 
                      alt="Delete" 
                      className="delete-icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(request.requestid);
                      }}
                    />
                  )
                )}
              ]}
              data={requests}
              onRowClick={(request) => navigate(`/requestInfo/${request.requestid}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestList;