// src/components/CSVGenerator.jsx

import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BackArrow from './BackArrow';

const CSVGenerator = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [columnOrder, setColumnOrder] = useState(['ClientName', 'PickupDate', 'PaymentMethod', 'TotalPayout', 'CheckNumber']);
  const [columnNames, setColumnNames] = useState({
    ClientName: 'Client Name',
    PickupDate: 'Receipt Date',
    PaymentMethod: 'Payment Method',
    TotalPayout: 'Total Payout',
    CheckNumber: 'Check Number'
  });
  const [message, setMessage] = useState('');
  const [unresolvedChecks, setUnresolvedChecks] = useState([]);

  const handleColumnOrderChange = (e, index) => {
    const newOrder = [...columnOrder];
    newOrder[index] = e.target.value;
    setColumnOrder(newOrder);
  };

  const handleColumnNameChange = (e, field) => {
    setColumnNames({ ...columnNames, [field]: e.target.value });
  };

  const handleGenerateCSV = async () => {
    try {
      const response = await axiosInstance.post('/api/generate-csv', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        columnOrder,
        columnNames
      }, { responseType: 'blob' });

      // Check if the response is JSON (error message) or Blob (CSV file)
      const contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // It's an error message
        const reader = new FileReader();
        reader.onload = () => {
          const errorData = JSON.parse(reader.result);
          setMessage(errorData.message);
          setUnresolvedChecks(errorData.unresolvedChecks || []);
        };
        reader.readAsText(response.data);
      } else {
        // It's a CSV file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'receipts.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setMessage('CSV file generated successfully!');
        setUnresolvedChecks([]);
      }
    } catch (error) {
      console.error('Error generating CSV:', error);
      setMessage('Error generating CSV file. Please try again.');
      setUnresolvedChecks([]);
    }
  };

  return (
    <div className="container mt-4">
      <BackArrow />
      <h2 className="text-center mb-4">Generate CSV</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {unresolvedChecks.length > 0 && (
        <div className="alert alert-warning">
          <h4>Unresolved Checks:</h4>
          <ul>
            {unresolvedChecks.map((check, index) => (
              <li key={index}>Receipt ID: {check.receiptid}, Client: {check.clientname}, Date: {check.pickupdate}</li>
            ))}
          </ul>
          <p>Please resolve these checks before generating the CSV.</p>
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); handleGenerateCSV(); }}>
        <div className="row mb-3">
          <div className="col">
            <label>Start Date:</label>
            <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="form-control" />
          </div>
          <div className="col">
            <label>End Date:</label>
            <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="form-control" />
          </div>
        </div>
        <div className="mb-3">
          <h5>Column Configuration:</h5>
          {columnOrder.map((field, index) => (
            <div key={field} className="row mb-2">
              <div className="col">
                <select className="form-control" value={field} onChange={(e) => handleColumnOrderChange(e, index)}>
                  {['ClientName', 'PickupDate', 'PaymentMethod', 'TotalPayout', 'CheckNumber'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  value={columnNames[field]}
                  onChange={(e) => handleColumnNameChange(e, field)}
                  placeholder="Column Name"
                />
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary">Generate CSV</button>
      </form>
    </div>
  );
};

export default CSVGenerator;