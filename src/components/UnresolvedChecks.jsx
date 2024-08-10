import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Logout from './Logout';
import BackArrow from './BackArrow';

const UnresolvedChecks = () => {
  const [unresolvedChecks, setUnresolvedChecks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkNumbers, setCheckNumbers] = useState({});

  useEffect(() => {
    fetchUnresolvedChecks();
  }, []);

  const fetchUnresolvedChecks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/unresolved-checks');
      setUnresolvedChecks(response.data.unresolvedChecks);
      setError(null);
    } catch (error) {
      console.error('Error fetching unresolved checks:', error);
      setError('Failed to fetch unresolved checks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (receiptID, value) => {
    setCheckNumbers(prev => ({ ...prev, [receiptID]: value }));
  };

  const handleUpdateCheckNumber = async (receiptID) => {
    const checkNumber = checkNumbers[receiptID];
    if (!checkNumber) return;

    try {
      await axiosInstance.post('/api/update-check-number', { receiptID, checkNumber });
      setSuccessMessage(`Check number updated successfully for receipt ${receiptID}`);
      fetchUnresolvedChecks(); // Refresh the list
      setCheckNumbers(prev => ({ ...prev, [receiptID]: '' })); // Clear the input
    } catch (error) {
      console.error('Error updating check number:', error);
      setError('Failed to update check number. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Logout /></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <BackArrow />
        <div className="card">
          <div className="card-header text-center">
            <h2>Unresolved Checks</h2>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {unresolvedChecks.length === 0 ? (
              <p>No unresolved checks found.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Receipt ID</th>
                    <th>Client Name</th>
                    <th>Pickup Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {unresolvedChecks.map(check => (
                    <tr key={check.receiptid}>
                      <td>{check.receiptid}</td>
                      <td>{check.clientname}</td>
                      <td>{new Date(check.pickupdate).toLocaleDateString()}</td>
                      <td>
                        <div className="input-group">
                          <input 
                            type="text" 
                            className="form-control"
                            placeholder="Enter check number"
                            value={checkNumbers[check.receiptid] || ''}
                            onChange={(e) => handleInputChange(check.receiptid, e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleUpdateCheckNumber(check.receiptid)}
                          />
                          <div className="input-group-append">
                            <button 
                              className="btn btn-primary" 
                              onClick={() => handleUpdateCheckNumber(check.receiptid)}
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnresolvedChecks;