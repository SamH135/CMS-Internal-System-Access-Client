import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import GenericPieChart from './GenericPieChart';
import Table from './Table';

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
        setCustomMetals(receiptResponse.data.customMetals);
        setCatalyticConverters(receiptResponse.data.catalyticConverters);
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
    if (!receipt || !metals) return null;

    if (receipt.clienttype === 'auto' || receipt.clienttype === 'hvac') {
      let allMetals = {};
      
      if (receipt.clienttype === 'auto') {
        allMetals = {
          "Drums & Rotors": parseFloat(metals.drumsrotorsweight) || 0,
          "Short Iron": parseFloat(metals.shortironweight) || 0,
          "Steel Shred": parseFloat(metals.steelshredweight) || 0,
          "Aluminum Radiators": parseFloat(metals.aluminumradiatorsweight) || 0,
          "Brass/Copper Radiators": parseFloat(metals.brasscoperradiatorsweight) || 0,
          "Aluminum": parseFloat(metals.aluminumweight) || 0,
          "Batteries": parseFloat(metals.batteriesweight) || 0
        };
      } else if (receipt.clienttype === 'hvac') {
        allMetals = {
          "Steel Shred": parseFloat(metals.steelshredweight) || 0,
          "Copper": parseFloat(metals.copperweight) || 0,
          "Brass": parseFloat(metals.brassweight) || 0,
          "Compressors": parseFloat(metals.compressorsweight) || 0,
          "Copper Coils": parseFloat(metals.coppercoilsweight) || 0,
          "Aluminum Coils": parseFloat(metals.aluminumcoilsweight) || 0,
          "Wire": parseFloat(metals.wireweight) || 0,
          "Brass/Copper Breakage": parseFloat(metals.brasscopperbreakageweight) || 0,
          "Electric Motors": parseFloat(metals.electricmotorsweight) || 0
        };
      }
      
      // Include custom metals in the distribution
      customMetals.forEach(metal => {
        if (parseFloat(metal.weight) > 0) {
          allMetals[metal.metalname] = parseFloat(metal.weight);
        }
      });

      return (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Metal Distribution</h5>
          </div>
          <div className="card-body">
            <GenericPieChart data={allMetals} />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderLeftColumn = () => {
    if (receipt.clienttype === 'insulation') {
      return (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Insulation Materials</h5>
          </div>
          <div className="card-body">
            <p>Steel Shred: {formatWeight(metals.steelshredweight)}</p>
            <p>Loads of Trash: {metals.loadsoftrash || 0}</p>
          </div>
        </div>
      );
    } else {
      return (
        <>
          {renderMetalDistribution()}
          {customMetals.length > 0 && (
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
          )}
          {receipt.clienttype === 'auto' && catalyticConverters.length > 0 && (
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
          )}
        </>
      );
    }
  };

  const formatCurrency = (value) => {
    return value ? `$${parseFloat(value).toFixed(2)}` : 'N/A';
  };

  const formatWeight = (value) => {
    return value ? `${parseFloat(value).toFixed(2)} lbs` : 'N/A';
  };

  if (!receipt || !metals) {
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
        <h1 className="text-center mb-4">Receipt for {receipt.clientname}</h1>
        <div className="row">
          <div className="col-md-6">
            {renderLeftColumn()}
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Receipt Details</h5>
              </div>
              <div className="card-body">
                <p>Receipt ID: {receipt.receiptid}</p>
                <p>Payment Method: {receipt.paymentmethod || 'N/A'}</p>
                <p>Total Volume: {formatWeight(receipt.totalvolume)}</p>
                <p>Total Payout: {formatCurrency(receipt.totalpayout)}</p>
                <p>Pickup Date: {new Date(receipt.pickupdate).toLocaleDateString()}</p>
                <p>Pickup Time: {new Date(receipt.pickuptime).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptInfo;