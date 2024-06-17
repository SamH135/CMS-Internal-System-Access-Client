// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
  const userType = useSelector((state) => state.auth.userType);

  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;