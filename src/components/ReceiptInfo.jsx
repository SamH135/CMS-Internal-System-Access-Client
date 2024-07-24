import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import GenericPieChart from './GenericPieChart';
import Table from './Table';
import BackArrow from './BackArrow';
import { formatTime } from '../dateUtils';

const ReceiptInfo = () => {
  const [receipt, setReceipt] = useState(null);
  const [metals, setMetals] = useState(null);
  const [customMetals, setCustomMetals] = useState([]);
  const [catalyticConverters, setCatalyticConverters] = useState([]);
  const { receiptID } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const [receiptResponse, metalsResponse] = await Promise.all([
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/receiptInfo/${receiptID}`),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/receiptMetals/${receiptID}`)
        ]);
        console.log('Receipt data:', receiptResponse.data);
        setReceipt(receiptResponse.data.receipt);
        setMetals(metalsResponse.data.metals);
        console.log('Metals data from API:', metalsResponse.data.metals);
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
            <GenericPieChart data={feeData} />
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
            <GenericPieChart data={filteredMetals} />
          </div>
        </div>
      );
    }
  };

  const renderMetalDetails = () => {
    if (!metals) return <p>No metal details available.</p>;
  
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>{receipt.clienttype === 'insulation' ? 'Fee Details' : 'Metal Details'}</h5>
        </div>
        <div className="card-body">
          {receipt.clienttype === 'insulation' ? (
            <>
              <p>Dump Fee: {formatCurrency(metals['Dump Fee'])}</p>
              <p>Haul Fee: {formatCurrency(metals['Haul Fee'])}</p>
            </>
          ) : (
            Object.entries(metals).map(([key, value]) => (
              <p key={key}>{key}: {formatWeight(value)}</p>
            ))
          )}
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
    return value ? `$${parseFloat(value).toFixed(2)}` : 'N/A';
  };

  const formatWeight = (value) => {
    return value ? `${parseFloat(value).toFixed(2)} lbs` : 'N/A';
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
            {renderCustomMetals()}
            {renderCatalyticConverters()}
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Receipt Details</h5>
              </div>
              <div className="card-body">
                <p>Receipt ID: {receipt.receiptid}</p>
                <p>Client ID: {receipt.clientid}</p>
                <p>Client Name: {receipt.clientname}</p>
                <p>Client Type: {receipt.clienttype}</p>
                <p>Payment Method: {receipt.paymentmethod || 'N/A'}</p>
                <p>Total Volume: {formatWeight(receipt.totalvolume)}</p>
                <p>Total Payout: {formatCurrency(receipt.totalpayout)}</p>
                <p>Pickup Date: {new Date(receipt.pickupdate).toLocaleDateString()}</p>
                <p>Pickup Time: {formatTime(receipt.pickuptime)} (Your local time)</p>
                <p>Created By: {receipt.createdby}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptInfo;