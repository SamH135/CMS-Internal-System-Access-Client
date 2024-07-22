import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import BackArrow from './BackArrow';

const SetAutoPrices = () => {
  const [prices, setPrices] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const relevantFields = useMemo(() => [
    'drumsrotorsprice',
    'shortironprice',
    'shredsteelprice',
    'aluminumbreakageprice',
    'dirtyaluminumradiatorsprice',
    'wiringharnessprice',
    'accompressorprice',
    'alternatorstarterprice',
    'aluminumrimsprice',
    'chromerimsprice',
    'brasscopperradiatorprice'
  ], []);

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      try {
        const response = await axiosInstance.get('/api/auto-prices');
        const filteredPrices = {};
        relevantFields.forEach(field => {
          filteredPrices[field] = response.data[field] || '';
        });
        setPrices(filteredPrices);
      } catch (error) {
        console.error('Error fetching Auto prices:', error);
        setMessage('Error fetching current prices. Please try again.');
      }
    };
    fetchCurrentPrices();
  }, [relevantFields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrices(prevPrices => ({ ...prevPrices, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pricesData = Object.fromEntries(
        Object.entries(prices).map(([key, value]) => [key, parseFloat(value)])
      );
      const response = await axiosInstance.post('/api/auto-prices', pricesData);
      setMessage(response.data.message);
      setTimeout(() => navigate('/set-prices'), 4000);
    } catch (error) {
      console.error('Error setting Auto prices:', error);
      setMessage('Error updating Auto prices. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <BackArrow />
      <h2 className="text-center mb-4">Set Auto Prices</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        {Object.entries(prices).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}:</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id={key}
              name={key}
              value={value}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3">Save Prices</button>
      </form>
    </div>
  );
};

export default SetAutoPrices;