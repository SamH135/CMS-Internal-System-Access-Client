import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <nav>
        <h4>Client Management System</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4 text-center">CMS - Home Page</h1>
          <p className="lead">This is a simple web application that uses JavaScript and mySQL to allow users to interact with a relational database that is used for inventory management purposes</p>
          <hr className="my-4" />
          <p>The functionality available to each user will depend on their job title. E.g. Employees can view/update the inventory, Supervisors can do that and place orders, Managers can do everything and add users</p>
          <p className="lead">
            <Link className="btn btn-primary btn-lg" to="#" role="button">Learn more</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;