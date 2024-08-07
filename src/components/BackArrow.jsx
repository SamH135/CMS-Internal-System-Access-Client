import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackArrow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const handleGoBack = () => {
    // always go back to the main dashboard from these pages
    if (location.pathname === '/userDashboard' || location.pathname === '/set-prices' || location.pathname === '/clientList' || location.pathname === '/pickupInfo' || location.pathname === '/receiptList' || location.pathname === '/view-loads' || location.pathname === '/unresolved-checks' || location.pathname === '/generate-csv') {
      navigate('/dashboard');
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      onClick={handleGoBack}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        width: '36px',
        height: '36px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: isHovered ? '#e8e8e8' : '#808080',
        marginRight: '10px',
        transition: 'background-color 0.3s'
      }}
    >
      <img
        src="/back_arrow.png"
        alt="Go Back"
        style={{
          width: '24px',
          height: '24px',
        }}
      />
    </div>
  );
};

export default BackArrow;