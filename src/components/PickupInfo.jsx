import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Table from './Table';
import BackArrow from './BackArrow';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PickupInfo = () => {
  const [pickupsToday, setPickupsToday] = useState([]);
  const [pickupsThisWeek, setPickupsThisWeek] = useState([]);
  const [pickupsThisMonth, setPickupsThisMonth] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPickupInfo();
  }, []);

  const fetchPickupInfo = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/pickupInfo`);
      console.log('Pickup Info Response:', response.data);

      const clients = response.data.clients || [];
      if (!Array.isArray(clients)) {
        console.error('Client data is not an array:', clients);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);

      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      setPickupsToday(clients.filter(client => new Date(client.lastpickupdate).toDateString() === today.toDateString()));
      setPickupsThisWeek(clients.filter(client => {
        const pickupDate = new Date(client.lastpickupdate);
        return pickupDate >= monday && pickupDate < today;
      }));
      setPickupsThisMonth(clients.filter(client => {
        const pickupDate = new Date(client.lastpickupdate);
        return pickupDate >= firstOfMonth && pickupDate < today;
      }));
    } catch (error) {
      console.error('Error retrieving pickup information:', error);
    }
  };
  
  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/searchClients?term=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data.clients || []);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  const handleRowClick = async (client) => {
    try {
      if (!client.clientid) {
        console.error('Client ID is undefined');
        //  might want to show an error message to the user here
        return;
      }
  
      const formattedDate = formatDateForQuery(client.lastpickupdate);
      
      // Fetch the receipt for this client's last pickup date
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/getReceiptByClientAndDate`, {
        params: {
          clientId: client.clientid,
          date: formattedDate
        }
      });
      
      if (response.data.receipt) {
        navigate(`/receiptInfo/${response.data.receipt.receiptid}`);
      } else {
        console.error('No receipt found for this pickup');
        //  might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
      //  might want to show an error message to the user here
    }
  };
  
  // Helper function to format date for the query
  const formatDateForQuery = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const renderTable = (data, title) => (
    <div className="card mb-4">
      <div className="card-header">
        <h5>{title}</h5>
      </div>
      <div className="card-body">
        {data.length > 0 ? (
          <Table
            columns={[
              { header: 'Client Name', field: 'clientname' },
              { header: 'Location', field: 'clientlocation' },
              { header: 'Last Pickup Date', field: 'lastpickupdate' },
              { header: 'Needs Pickup', field: 'needspickup' },
            ]}
            data={data.map((client) => ({
              ...client,
              lastpickupdate: formatDate(client.lastpickupdate),
              needspickup: client.needspickup ? 'Yes' : 'No',
            }))}
            onRowClick={handleRowClick}
          />
        ) : (
          <p className="text-center">No pickups logged {title.toLowerCase()}</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><button onClick={() => navigate('/logout')}>Logout</button></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <BackArrow />
        <div className="card mb-4">
          <div className="card-header text-center d-flex justify-content-center align-items-center">
            <img src="/route_info_button_icon.png" alt="Pickup info icon" className="card-icon me-2" />
            <strong>Pickup Information</strong>
          </div>
          <div className="card-body">
            <div className="search-container">
              <input 
                type="text" 
                id="searchInput" 
                className="form-control" 
                placeholder="Search by client name or location" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              />
              <img 
                src="/search_button_icon.png" 
                alt="Search" 
                className={`search-icon ${searchTerm ? 'hidden' : ''}`}
                onClick={handleSearch}
              />
              <img 
                src="/close_button_icon.png" 
                alt="Clear" 
                className={`clear-icon ${searchTerm ? '' : 'hidden'}`}
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                  fetchPickupInfo();
                }}
              />
            </div>
          </div>
        </div>

        {searchResults.length > 0 ? (
          renderTable(searchResults, "Search Results")
        ) : (
          <>
            {renderTable(pickupsToday, "Today")}
            {renderTable(pickupsThisWeek, "This Week")}
            {renderTable(pickupsThisMonth, "This Month")}
          </>
        )}
      </div>
    </div>
  );
};

export default PickupInfo;