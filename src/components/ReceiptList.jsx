import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import Table from './Table';
import BackArrow from './BackArrow';
import { formatDate } from '../dateUtils';


const ReceiptList = () => {
  const token = useSelector((state) => state.auth.token);
  const [receipts, setReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchReceipts();
    }
  }, [token, navigate]);

  const fetchReceipts = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/receiptList`);
      setReceipts(response.data.receipts);
    } catch (error) {
      console.error('Error retrieving receipts:', error);
    }
  };
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchReceipts?term=${encodeURIComponent(searchTerm)}`);
      setReceipts(response.data.receipts);
    } catch (error) {
      console.error('Error searching receipts:', error);
    }
  };

  const handleReceiptClick = (receiptID) => {
    navigate(`/receiptInfo/${receiptID}`);
  };

  return (
    <div>
      <nav>
        <h4>Receipt Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
      <BackArrow />
        <div className="card">
          <div className="card-header text-center d-flex justify-content-center align-items-center">
            <img src="/receipt_log_button_icon.png" alt="Receipt icon" className="card-icon me-2" />
            <strong>Receipt Log</strong>
          </div>
          <div className="card-body">
            <div className="search-container">
              <input 
                type="text" 
                id="searchInput" 
                className="form-control" 
                placeholder="Search by receipt ID or client name" 
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
                  fetchReceipts();
                }}
              />
            </div>
            <Table
              columns={[
                { header: 'Receipt ID', field: 'receiptid' },
                { header: 'Client Name', field: 'clientname' },
                { header: 'Pickup Date', field: 'pickupdate' },
                { header: 'Total Payout', field: 'totalpayout', formatter: (value) => `$${value.toFixed(2)}` },
              ]}
              data={receipts.map((receipt) => ({
                ...receipt,
                pickupdate: formatDate(receipt.pickupdate),
              }))}
              onRowClick={(receipt) => handleReceiptClick(receipt.receiptid)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptList;