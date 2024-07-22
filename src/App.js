// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/actions/authActions';
import { useSelector } from 'react-redux';
import Index from './components/Index';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientInfo from './components/ClientInfo';
import PickupInfo from './components/PickupInfo';
import UserDashboard from './components/UserDashboard';
import EditUser from './components/EditUser';
import PrivateRoute from './components/PrivateRoute.jsx';
import ReceiptList from './components/ReceiptList';
import ReceiptInfo from './components/ReceiptInfo';
import RequestList from './components/RequestList';
import SessionExpiredModal from './components/SessionExpiredModal';
import useInactivityCheck from './hooks/useInactivityCheck';
import AddClient from './components/AddClient.jsx';
import SetPricesPage from './components/SetPricesPage';
import SetHVACPrices from './components/SetHVACPrices';
import SetAutoPrices from './components/SetAutoPrices';

function App() {
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  useInactivityCheck(); // Use the new hook

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    if (token && storedUserType) {
      dispatch(loginSuccess(token, storedUserType));
    }

    const handleSessionExpired = () => {
      setShowSessionExpiredModal(true);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [dispatch]);

  return (
    <Router>
      <SessionExpiredModal
        show={showSessionExpiredModal}
        onHide={() => setShowSessionExpiredModal(false)}
      />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
        <Route path="/clientList" element={<PrivateRoute element={ClientList} />} />
        <Route path="/clientInfo/:clientID" element={<PrivateRoute element={ClientInfo} />} />
        <Route path="/pickupInfo" element={<PrivateRoute element={PickupInfo} />} />
        <Route path="/userDashboard" element={<PrivateRoute element={UserDashboard} roles={['admin']} />} />
        <Route path="/editUser/:userID" element={<PrivateRoute element={EditUser} roles={['admin']} />} />
        <Route path="*" element={<Navigate to={userType ? '/dashboard' : '/login'} />} />
        <Route path="/receiptList" element={<ReceiptList />} />
        <Route path="/receiptInfo/:receiptID" element={<ReceiptInfo />} />
        <Route path="/requestList" element={<RequestList />} />
        <Route path="/addClient" element={<PrivateRoute element={AddClient} roles={['admin']} />} />
        <Route path="/set-prices" element={<PrivateRoute element={SetPricesPage} roles={['admin']} />} />
        <Route path="/set-hvac-prices" element={<PrivateRoute element={SetHVACPrices} roles={['admin']} />} />
        <Route path="/set-auto-prices" element={<PrivateRoute element={SetAutoPrices} roles={['admin']} />} />
      </Routes>
    </Router>
  );
}

export default App;