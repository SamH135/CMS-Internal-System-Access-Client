import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import GenericPieChart from './GenericPieChart';
import Table from './Table';
import BackArrow from './BackArrow';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
const ReceiptInfo = () => {
  const [receipt, setReceipt] = useState(null);
  const [metals, setMetals] = useState(null);
  const [customMetals, setCustomMetals] = useState([]);
  const [catalyticConverters, setCatalyticConverters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [checkNumber, setCheckNumber] = useState('');
  const { receiptID } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = token ? jwtDecode(token).userType === 'admin' : false;

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const [receiptResponse, metalsResponse, checkPaymentResponse] = await Promise.all([
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/receiptInfo/${receiptID}`),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/receiptMetals/${receiptID}`),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/checkPayment/${receiptID}`)
        ]);
        setReceipt(receiptResponse.data.receipt);
        setCheckNumber(checkPaymentResponse.data.checkNumber || '');
        
        if (receiptResponse.data.receipt.clienttype === 'other') {
          const customMetalsObj = receiptResponse.data.customMetals.reduce((acc, metal) => {
            acc[metal.metalname] = parseFloat(metal.weight);
            return acc;
          }, {});
          setMetals(customMetalsObj);
        } else {
          setMetals(metalsResponse.data.metals);
        }
        
        setCustomMetals(receiptResponse.data.customMetals || []);
        setCatalyticConverters(receiptResponse.data.catalyticConverters || []);
      } catch (error) {
        console.error('Error retrieving receipt data:', error);
      }
    };
  
    if (token) {
      fetchReceiptData();
    } else {
      navigate('/login');
    }
  }, [receiptID, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReceipt(prevReceipt => ({
      ...prevReceipt,
      [name]: value
    }));
  };

  const handleUpdateReceipt = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateReceipt`, receipt);
      if (checkNumber) {
        await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateCheckNumber`, {
          receiptID: receipt.receiptid,
          checkNumber
        });
      }
      setIsEditing(false);
      // Refresh the data after update
      const [updatedReceipt, updatedCheckPayment] = await Promise.all([
        axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/receiptInfo/${receiptID}`),
        axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/checkPayment/${receiptID}`)
      ]);
      setReceipt(updatedReceipt.data.receipt);
      setCheckNumber(updatedCheckPayment.data.checkNumber || '');
    } catch (error) {
      console.error('Error updating receipt:', error.response?.data || error.message);
    }
  };

  const renderMetalDistribution = () => {
    if (!receipt || !metals) return <p>No metal distribution data available.</p>;
  
    if (receipt.clienttype === 'insulation') {
      const feeData = {
        'Dump Fee': parseFloat(metals['Dump Fee'] || 0),
        'Haul Fee': parseFloat(metals['Haul Fee'] || 0)
      };
      return (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Fee Distribution</h5>
          </div>
          <div className="card-body">
            <GenericPieChart 
              data={feeData}
              valueFormatter={(value) => `$${parseFloat(value).toFixed(2)}`}
            />
          </div>
        </div>
      );
    } else {
      // Filter out zero values and undefined
      const filteredMetals = Object.entries(metals).reduce((acc, [key, value]) => {
        if (value && parseFloat(value) > 0) {
          acc[key] = parseFloat(value);
        }
        return acc;
      }, {});
  
      if (Object.keys(filteredMetals).length === 0) {
        return <p>No metal distribution data available.</p>;
      }
  
      return (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Metal Distribution</h5>
          </div>
          <div className="card-body">
            <GenericPieChart 
              data={filteredMetals}
              valueFormatter={(value) => `${parseFloat(value).toFixed(2)} lbs`}
            />
          </div>
        </div>
      );
    }
  };


  const renderMetalDetails = () => {
    if (!metals || Object.keys(metals).length === 0) return <p>No metal details available.</p>;
  
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>{receipt.clienttype === 'insulation' ? 'Fee Details' : 'Metal Details'}</h5>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>{receipt.clienttype === 'insulation' ? 'Fee Type' : 'Metal Name'}</th>
                <th>{receipt.clienttype === 'insulation' ? 'Amount' : 'Weight'}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metals).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>
                    {receipt.clienttype === 'insulation' 
                      ? formatCurrency(value)
                      : formatWeight(value)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCustomMetals = () => {
    if (customMetals.length === 0) return null;

    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>Custom Metals</h5>
        </div>
        <div className="card-body">
          <Table
            columns={[
              { header: 'Metal Name', field: 'metalname' },
              { header: 'Weight', field: 'weight', formatter: formatWeight },
              { header: 'Price', field: 'price', formatter: formatCurrency },
            ]}
            data={customMetals}
          />
        </div>
      </div>
    );
  };

  const renderCatalyticConverters = () => {
    if (receipt?.clienttype !== 'auto' || catalyticConverters.length === 0) return null;

    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>Catalytic Converters</h5>
        </div>
        <div className="card-body">
          <Table
            columns={[
              { header: 'Part Number', field: 'partnumber' },
              { header: 'Price', field: 'price', formatter: formatCurrency },
              { header: 'Percent Full', field: 'percentfull', formatter: (value) => `${parseFloat(value).toFixed(2)}%` },
            ]}
            data={catalyticConverters}
          />
        </div>
      </div>
    );
  };

  const formatCurrency = (value) => {
    return value !== null && value !== undefined ? `$${parseFloat(value).toFixed(2)}` : 'N/A';
  };
  
  const formatWeight = (value) => {
    return value !== null && value !== undefined ? `${parseFloat(value).toFixed(2)} lbs` : 'N/A';
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(parseISO(dateTimeString), userTimeZone, 'MMMM d, yyyy h:mm a (zzz)');
  };

  const renderEditableFields = () => {
    return (
      <form onSubmit={handleUpdateReceipt}>
        <div className="form-group">
          <label htmlFor="totalpayout">Total Payout:</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="totalpayout"
            name="totalpayout"
            value={receipt.totalpayout}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentmethod">Payment Method:</label>
          <select
            className="form-control"
            id="paymentmethod"
            name="paymentmethod"
            value={receipt.paymentmethod}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="Direct Deposit">Direct Deposit</option>
          </select>
        </div>
        {(receipt.paymentmethod === 'Check' || checkNumber) && (
          <div className="form-group">
            <label htmlFor="checknumber">Check Number:</label>
            <input
              type="text"
              className="form-control"
              id="checknumber"
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        )}
        {isEditing && (
          <button type="submit" className="btn btn-primary mt-3">Save Changes</button>
        )}
      </form>
    );
  };

  if (!receipt) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav>
        <h4>Receipt Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/receiptList">Receipt List</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <BackArrow />
        <h1 className="text-center mb-4">Receipt for {receipt.clientname}</h1>
        <div className="row">
          <div className="col-md-6">
            {renderMetalDistribution()}
            {renderMetalDetails()}
            {receipt.clienttype !== 'other' && renderCustomMetals()}
            {renderCatalyticConverters()}
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Receipt Details</h5>
                {isAdmin && (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
              <div className="card-body">
                <p>Receipt ID: {receipt.receiptid}</p>
                <p>Client ID: {receipt.clientid}</p>
                <p>Client Name: {receipt.clientname}</p>
                <p>Client Type: {receipt.clienttype}</p>
                <p>Total Volume: {formatWeight(receipt.totalvolume)}</p>
                <p>Pickup Date and Time: {formatDateTime(receipt.pickuptime)}</p>
                <p>Created By: {receipt.createdby}</p>
                {renderEditableFields()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptInfo;