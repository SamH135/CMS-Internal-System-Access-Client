// src/components/ClientInfo.jsx

import React, { useEffect, useState, useReducer } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import GenericPieChart from './GenericPieChart';
import BackArrow from './BackArrow';
import { parseISO, differenceInDays, startOfDay } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';


const feeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_INITIAL_FEES':
      return { dumpFee: action.payload.dumpFee, haulFee: action.payload.haulFee };
    case 'UPDATE_FEE':
      return { ...state, [action.payload.feeType]: action.payload.value };
    default:
      return state;
  }
};

const ClientInfo = () => {
  const [client, setClient] = useState(null);
  const [metals, setMetals] = useState({});
  const [totals, setTotals] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [feeState, feeDispatch] = useReducer(feeReducer, { dumpFee: 0, haulFee: 0 });
  const [dumpFeeAdjustment, setDumpFeeAdjustment] = useState('');
  const [haulFeeAdjustment, setHaulFeeAdjustment] = useState('');
  const { clientID } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = token ? jwtDecode(token).userType === 'admin' : false;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const [clientResponse, metalsResponse, totalsResponse] = await Promise.all([
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/clientInfo/${clientID}`),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/clientMetals/${clientID}`),
          axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/clientTotals/${clientID}`)
        ]);
        setClient(clientResponse.data.client);
        setMetals(metalsResponse.data.metals);
        setTotals(totalsResponse.data.totals);
  
        const dumpFee = parseFloat(metalsResponse.data.metals['Dump Fees'] || 0);
        const haulFee = parseFloat(metalsResponse.data.metals['Haul Fees'] || 0);
  
        feeDispatch({
          type: 'SET_INITIAL_FEES',
          payload: { dumpFee, haulFee }
        });
      } catch (error) {
        console.error('Error retrieving client data:', error);
      }
    };
  
    if (token) {
      fetchClientData();
    } else {
      navigate('/login');
    }
  }, [clientID, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/updateClient`, client);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleFeeInputChange = (feeType, value) => {
    if (feeType === 'dumpfee') {
      setDumpFeeAdjustment(value);
    } else {
      setHaulFeeAdjustment(value);
    }
  };

  const handleFeeAdjustment = async (feeType, amount, isAddition = true) => {
    if (!isAdmin) return;
  
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      console.error('Invalid amount');
      return;
    }
  
    const feeKey = feeType === 'dumpfee' ? 'dumpFee' : 'haulFee';
    const confirmMessage = isAddition 
      ? `Are you sure you want to add $${numericAmount.toFixed(2)} to the ${feeType === 'dumpfee' ? 'Dump' : 'Haul'} Fee?`
      : `Warning: You are about to set the ${feeType === 'dumpfee' ? 'Dump' : 'Haul'} Fee to $${numericAmount.toFixed(2)}. This will overwrite the current value. Are you sure?`;
  
    if (window.confirm(confirmMessage)) {
      // Calculate the new fee value
      const currentFee = feeState[feeKey];
      const newFee = isAddition ? currentFee + numericAmount : numericAmount;
  
      // Immediately update the state with the new calculated value
      feeDispatch({
        type: 'UPDATE_FEE',
        payload: { feeType: feeKey, value: newFee }
      });
  
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/adjustInsulationFee`, {
          clientID: client.clientid,
          feeType,
          amount: numericAmount,
          isAddition
        });
        
        if (response.data.success) {
          const updatedFee = parseFloat(response.data[feeType]);
          if (!isNaN(updatedFee)) {
            // Update with the server's response
            feeDispatch({
              type: 'UPDATE_FEE',
              payload: { feeType: feeKey, value: updatedFee }
            });
  
            setMetals(prevMetals => ({
              ...prevMetals,
              [feeType === 'dumpfee' ? 'Dump Fees' : 'Haul Fees']: updatedFee
            }));
  
            // Update totals
            setTotals(prevTotals => ({
              ...prevTotals,
              totalpayout: parseFloat(prevTotals.totalpayout) + (isAddition ? numericAmount : updatedFee - currentFee)
            }));
          } else {
            console.error('Invalid fee value received from server');
          }
        }
      } catch (error) {
        console.error(`Error adjusting ${feeType}:`, error);
        // Revert to the original value if there's an error
        feeDispatch({
          type: 'UPDATE_FEE',
          payload: { feeType: feeKey, value: currentFee }
        });
      } finally {
        // Clear adjustment input
        if (feeType === 'dumpfee') {
          setDumpFeeAdjustment('');
        } else {
          setHaulFeeAdjustment('');
        }
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(parseISO(dateString), userTimeZone, 'yyyy-MM-dd');
  };
  
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(parseISO(dateTimeString), userTimeZone, 'MMMM d, yyyy h:mm a');
  };

  const daysSinceLastPickup = () => {
    if (!totals.lastpickuptime) return 'N/A';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lastPickup = toZonedTime(parseISO(totals.lastpickuptime), userTimeZone);
    const today = toZonedTime(startOfDay(new Date()), userTimeZone);
    return differenceInDays(today, lastPickup) + 1; // Add 1 to include the pickup day
  };

  const daysOverdue = () => {
    const daysSince = daysSinceLastPickup();
    if (daysSince === 'N/A' || !client.avgtimebetweenpickups) return 'N/A';
    const overdueDays = daysSince - client.avgtimebetweenpickups;
    return overdueDays > 0 ? overdueDays : 0;
  };

  const needsPickup = () => {
    const daysSince = daysSinceLastPickup();
    if (daysSince === 'N/A' || !client.avgtimebetweenpickups) return false;
    return daysSince >= client.avgtimebetweenpickups;
  };

  const renderMetalDistribution = () => {
    if (!client || !metals) return null;
  
    if (client.clienttype === 'insulation') {
      const feeData = {
        'Dump Fees': feeState.dumpFee,
        'Haul Fees': feeState.haulFee
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
      return (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Metal Distribution</h5>
          </div>
          <div className="card-body">
            <GenericPieChart 
              data={metals}
              valueFormatter={(value) => `${parseFloat(value).toFixed(2)} lbs`}
            />
          </div>
        </div>
      );
    }
  };

  const renderPickupInfo = () => {
    // don't show pickup info for insulation clients
    if(client.clienttype === 'insulation') return null;

    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>Pickup Information</h5>
        </div>
        <div className="card-body">
          <p>Last Pickup Date: {totals.lastpickuptime ? formatDateTime(totals.lastpickuptime) : 'N/A'}</p>
          <p>Days Since Last Pickup: {daysSinceLastPickup()}</p>
          <p>Days Overdue for Pickup: {daysOverdue()}</p>
          <p>
            Needs Pickup:{" "}
            <span 
              className={`fw-bold ${needsPickup() ? 'bg-danger text-white' : ''}`}
              style={{
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {needsPickup() ? 'Yes' : 'No'}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const renderClientTotals = () => {
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>Client Totals</h5>
        </div>
        <div className="card-body">
          {client.clienttype === 'insulation' ? (
            <>
              <p>Total Dump Fees: ${feeState.dumpFee.toFixed(2)}</p>
              <p>Total Haul Fees: ${feeState.haulFee.toFixed(2)}</p>
            </>
          ) : (
            Object.entries(metals).map(([key, value]) => (
              <p key={key}>{key}: {parseFloat(value).toFixed(2)} lbs</p>
            ))
          )}
          <p>Total Payout: ${parseFloat(totals.totalpayout || 0).toFixed(2)}</p>
        </div>
      </div>
    );
  };

  const renderInsulationFees = () => {
    if (client.clienttype !== 'insulation' || !isAdmin) return null;
  
    return (
      <div className="card mb-4">
        <div className="card-header">
          <h5>Insulation Fees</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label>Dump Fee: ${feeState.dumpFee.toFixed(2)}</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={dumpFeeAdjustment}
                onChange={(e) => handleFeeInputChange('dumpfee', e.target.value)}
                placeholder="0"
              />
              <button className="btn btn-primary" onClick={() => handleFeeAdjustment('dumpfee', dumpFeeAdjustment)}>Add</button>
              <button className="btn btn-outline-warning" onClick={() => handleFeeAdjustment('dumpfee', dumpFeeAdjustment, false)}>Set</button>
            </div>
          </div>
          <div className="mb-3">
            <label>Haul Fee: ${feeState.haulFee.toFixed(2)}</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={haulFeeAdjustment}
                onChange={(e) => handleFeeInputChange('haulfee', e.target.value)}
                placeholder="0"
              />
              <button className="btn btn-primary" onClick={() => handleFeeAdjustment('haulfee', haulFeeAdjustment)}>Add</button>
              <button className="btn btn-outline-warning" onClick={() => handleFeeAdjustment('haulfee', haulFeeAdjustment, false)}>Set</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!client || !metals || !totals) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/clientList">Client List</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="text-center">
          <h1 className="mb-4 d-inline-flex align-items-center">
            <BackArrow />
            <span className="ms-2">
              {client.clientname} 
              <span className="ms-2">
                ({client.clienttype})
              </span>
            </span>
          </h1>
        </div>
        <div className="row">
          <div className="col-md-6">
            {renderMetalDistribution()}
            {renderClientTotals()}
            {renderPickupInfo()}
            {renderInsulationFees()}
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="w-100 text-center">
                  <h5>Client Information</h5>
                </div>
                {isAdmin && (
                  <button className="btn btn-primary" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                )}
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdateClient}>
                  {[
                    { label: 'Client ID', key: 'clientid', type: 'text' },
                    { label: 'Client Name', key: 'clientname', type: 'text' },
                    { label: 'Client Location', key: 'clientlocation', type: 'text' },
                    { label: 'Client Type', key: 'clienttype', type: 'select' },
                    { label: 'Average Time Between Pickups', key: 'avgtimebetweenpickups', type: 'number' },
                    { label: 'Location Notes', key: 'locationnotes', type: 'textarea' },
                    { label: 'Registration Date', key: 'registrationdate', type: 'date' },
                    { label: 'Location Contact', key: 'locationcontact', type: 'text' },
                    { label: 'Payment Method', key: 'paymentmethod', type: 'select' }, // Changed to 'select'
                    
                  ].map(({ label, key, type }) => (
                    <div className="form-group" key={key}>
                      <label htmlFor={key}>{label}:</label>
                      {type === 'select' ? (
                        <select
                          className="form-control"
                          name={key}
                          id={key}
                          value={client[key] || ''}
                          onChange={handleInputChange}
                          disabled={!isEditing || key === 'clientid'}
                        >
                          {key === 'clienttype' ? (
                            <>
                              <option value="auto">Auto</option>
                              <option value="hvac">HVAC</option>
                              <option value="insulation">Insulation</option>
                              <option value="other">Other</option>
                            </>
                          ) : key === 'paymentmethod' ? (
                            <>
                              <option value="Cash">Cash</option>
                              <option value="Check">Check</option>
                              <option value="Direct Deposit">Direct Deposit</option>
                            </>
                          ) : null}
                        </select>
                      ) : type === 'textarea' ? (
                        <textarea
                          className="form-control"
                          name={key}
                          id={key}
                          value={client[key] || ''}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      ) : (
                        <input
                          type={type}
                          className="form-control"
                          name={key}
                          id={key}
                          value={type === 'date' ? formatDate(client[key]) : (client[key] || '')}
                          checked={type === 'checkbox' ? Boolean(client[key]) : undefined}
                          onChange={handleInputChange}
                          readOnly={!isEditing || key === 'clientid'}
                        />
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button type="submit" className="btn btn-success mt-3">Save Changes</button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };
  
  export default ClientInfo;