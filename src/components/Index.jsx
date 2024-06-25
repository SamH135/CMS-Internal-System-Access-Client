import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4 text-center">CMS - Home Page</h1>
          <p className="lead">This is a React web application that connects to an API server with a PostgreSQL database to allow users to interact with the relational database that is used for client data management purposes</p>
          <hr className="my-4" />
          <p>The functionality available to each user will depend on their access level. E.g. Regular employees can view client data and route/receipt information, administrators can update and delete data for clients/user/etc. </p>
          
        </div>
      </div>
    </div>
  );
};

export default Index;