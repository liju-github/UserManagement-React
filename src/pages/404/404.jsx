import React from 'react';
import { Link } from 'react-router-dom';
import './404.css'; 

const NotFound = () => {
    return (
        <div className="notfound-container">
            <h1 className="notfound-header">404</h1>
            <p className="notfound-subtext">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="notfound-link"><button>Go back to Home</button></Link>
        </div>
    );
};

export default NotFound;
