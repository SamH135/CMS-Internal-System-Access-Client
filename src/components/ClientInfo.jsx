import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import GenericPieChart from './GenericPieChart';

const ClientInfo = () => {
  const [client, setClient] = useState(null);
  const [metals, setMetals] = useState({});
  const [totals, setTotals] = useState({});
  const [isEditing, setIsEditing] = useState(false);
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

  const daysSinceLastPickup = () => {
    if (!totals.lastpickupdate) return 'N/A';
    const lastPickup = new Date(totals.lastpickupdate);
    const today = new Date();
    
    lastPickup.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today - lastPickup);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysOverdue = () => {
    const daysSince = daysSinceLastPickup();
    if (daysSince === 'N/A' || !client.avgtimebetweenpickups) return 'N/A';
    const overdueDays = daysSince - client.avgtimebetweenpickups;
    return overdueDays > 0 ? overdueDays : 0;
  };

  const formatDateForInput = (dateString) => {
    return dateString ? dateString.split('T')[0] : '';
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
      <h1 className="text-center mb-4">{client.clientname}</h1>
        <div className="row">
          <div className="col-md-6">
            {client.clienttype !== 'insulation' ? (
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Metal Distribution</h5>
                </div>
                <div className="card-body">
                  <GenericPieChart data={metals} />
                </div>
              </div>
            ) : (
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Insulation Data</h5>
                </div>
                <div className="card-body">
                  <p>Steel Shred: {metals["Steel Shred"] || 0} lbs</p>
                  <p>Loads of Trash: {metals["Loads of Trash"] || 0}</p>
                </div>
              </div>
            )}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Client Totals</h5>
              </div>
              <div className="card-body">
                {client.clienttype !== 'insulation' ? (
                  <>
                    <p>Total Volume: {totals.totalvolume} lbs</p>
                    <p>Total Payout: ${totals.totalpayout}</p>
                  </>
                ) : (
                  <>
                    <p>Steel Shred: {metals["Steel Shred"] || 0} lbs</p>
                    <p>Loads of Trash: {metals["Loads of Trash"] || 0}</p>
                  </>
                )}
                <p>Last Pickup Date: {new Date(totals.lastpickupdate).toLocaleDateString()}</p>
                <p>Days Since Last Pickup: {daysSinceLastPickup()}</p>
                <p>Days Overdue for Pickup: {daysOverdue()}</p>
                <p>Needs Pickup: {client.needspickup ? 'Yes' : 'No'}</p>
              </div>
            </div>
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
                    { label: 'Payment Method', key: 'paymentmethod', type: 'text' },
                    { label: 'Last Pickup Date', key: 'lastpickupdate', type: 'date' }
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
                          <option value="auto">Auto</option>
                          <option value="hvac">HVAC</option>
                          <option value="insulation">Insulation</option>
                          <option value="other">Other</option>
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
                          value={type === 'date' ? formatDateForInput(client[key]) : (client[key] || '')}
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