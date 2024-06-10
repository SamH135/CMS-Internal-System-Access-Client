import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './components/Index';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientInfo from './components/ClientInfo';
import PickupInfo from './components/PickupInfo';
import UserDashboard from './components/UserDashboard';
import EditUser from './components/EditUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientList" element={<ClientList />} />
        <Route path="/clientInfo/:clientID" element={<ClientInfo />} />
        <Route path="/pickupInfo" element={<PickupInfo />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/editUser/:userID" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;