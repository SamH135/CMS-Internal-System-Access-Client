import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BackArrow from './BackArrow';

const CSVGenerator = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [columns, setColumns] = useState([
    { id: 'ClientName', name: 'Client Name' },
    { id: 'PickupDate', name: 'Receipt Date' },
    { id: 'PaymentMethod', name: 'Payment Method' },
    { id: 'TotalPayout', name: 'Total Payout' },
    { id: 'CheckNumber', name: 'Check Number' }
  ]);
  const [message, setMessage] = useState('');
  const [unresolvedChecks, setUnresolvedChecks] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const navigate = useNavigate();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchPreviewData = useCallback(async () => {
    try {
      const response = await axiosInstance.post('/api/preview-csv', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        columnOrder: columns.map(col => col.id),
        columnNames: Object.fromEntries(columns.map(col => [col.id, col.name])),
        timeZone
      });
      
      setPreviewData(response.data.previewData);
    } catch (error) {
      console.error('Error fetching preview data:', error);
      setPreviewData([]);
    }
  }, [startDate, endDate, columns, timeZone]);

  useEffect(() => {
    fetchPreviewData();
  }, [fetchPreviewData]);

  const handleColumnChange = (index, field, value) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      if (field === 'id') {
        newColumns[index] = { ...newColumns[index], id: value };
      } else if (field === 'name') {
        newColumns[index] = { ...newColumns[index], name: value };
      }
      return newColumns;
    });
  };


  const handleGenerateCSV = async () => {
    try {
      const checkResponse = await axiosInstance.get('/api/unresolved-checks');
      if (checkResponse.data.unresolvedChecks.length > 0) {
        setUnresolvedChecks(checkResponse.data.unresolvedChecks);
        setMessage('There are unresolved checks. Please resolve them before generating the CSV.');
        return;
      }

      const response = await axiosInstance.post('/api/generate-csv', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        columnOrder: columns.map(col => col.id),
        columnNames: Object.fromEntries(columns.map(col => [col.id, col.name])),
        timeZone
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'receipts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('CSV file generated successfully!');
      setUnresolvedChecks([]);
    } catch (error) {
      console.error('Error generating CSV:', error);
      setMessage('Error generating CSV file. Please try again.');
    }
  };



  return (
    <div className="container mt-4">
      <BackArrow />
      <h2 className="text-center mb-4">Generate CSV</h2>
      {message && <div className="alert alert-info">{message}</div>}

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
          {columns.map((column, index) => (
            <div key={index} className="row mb-2">
              <div className="col">
                <select 
                  className="form-control" 
                  value={column.id} 
                  onChange={(e) => handleColumnChange(index, 'id', e.target.value)}
                >
                  {['ClientName', 'PickupDate', 'PaymentMethod', 'TotalPayout', 'CheckNumber'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  value={column.name}
                  onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                  placeholder="Column Name"
                />
              </div>
            </div>
          ))}
        </div>
        <h5>CSV Preview:</h5>
        <div className="table-responsive mb-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column.id}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(column => (
                    <td key={column.id}>{row[column.id] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="btn btn-primary" disabled={unresolvedChecks.length > 0}>
          Generate CSV
        </button>
      </form>
    </div>
  );
};

export default CSVGenerator;