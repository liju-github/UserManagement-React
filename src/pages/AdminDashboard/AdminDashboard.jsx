import React from 'react'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import UserList from '../../components/UserList/UserList'

const AdminDashboard = () => {
  return (
      <div>
      <LogoutButton></LogoutButton>
      <UserList></UserList>
    </div>
  )
}

export default AdminDashboard
