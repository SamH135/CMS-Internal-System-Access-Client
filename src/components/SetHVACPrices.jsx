import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const SetHVACPrices = () => {
  const [prices, setPrices] = useState({
    ShredSteelPrice: '',
    DirtyAlumCopperRadiatorsPrice: '',
    CleanAluminumRadiatorsPrice: '',
    CopperTwoPrice: '',
    CompressorsPrice: '',
    DirtyBrassPrice: '',
    ElectricMotorsPrice: '',
    AluminumBreakagePrice: '',
  });
  const [effectiveDate, setEffectiveDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/hvacPrices`);
        if (response.data.prices) {
          setPrices(response.data.prices);
          setEffectiveDate(response.data.prices.EffectiveDate);
        }
      } catch (error) {
        console.error('Error fetching current HVAC prices:', error);
      }
    };

    fetchCurrentPrices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrices(prevPrices => ({
      ...prevPrices,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/setHVACPrices`, {
        ...prices,
        EffectiveDate: effectiveDate
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting HVAC prices:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Set HVAC Metal Prices</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="effectiveDate">Effective Date:</label>
          <input
            type="date"
            className="form-control"
            id="effectiveDate"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            required
          />
        </div>
        {Object.entries(prices).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
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
        <button type="submit" className="btn btn-primary">Set Prices</button>
      </form>
    </div>
  );
};

export default SetHVACPrices;