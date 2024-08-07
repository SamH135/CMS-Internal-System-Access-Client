// UnresolvedChecks.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const UnresolvedChecks = () => {
  const [unresolvedChecks, setUnresolvedChecks] = useState([]);

  useEffect(() => {
    fetchUnresolvedChecks();
  }, []);

  const fetchUnresolvedChecks = async () => {
    try {
      const response = await axiosInstance.get('/api/unresolved-checks');
      setUnresolvedChecks(response.data.unresolvedChecks);
    } catch (error) {
      console.error('Error fetching unresolved checks:', error);
    }
  };

  const handleUpdateCheckNumber = async (receiptID, checkNumber) => {
    try {
      await axiosInstance.post('/api/update-check-number', { receiptID, checkNumber });
      fetchUnresolvedChecks(); // Refresh the list
    } catch (error) {
      console.error('Error updating check number:', error);
    }
  };

  return (
    <div>
      <h2>Unresolved Checks</h2>
      <table>
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
              <td>{check.pickupdate}</td>
              <td>
                <input 
                  type="text" 
                  placeholder="Enter check number"
                  onChange={(e) => handleUpdateCheckNumber(check.receiptid, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnresolvedChecks;