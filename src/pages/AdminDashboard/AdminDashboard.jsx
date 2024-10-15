import React from 'react';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import UserList from '../../components/UserList/UserList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboardContainer">
      <div className="header">
        <LogoutButton className="logoutButton" />
      </div>
      <div className="userListContainer">
        <UserList />
      </div>
    </div>
  );
};

export default AdminDashboard;
