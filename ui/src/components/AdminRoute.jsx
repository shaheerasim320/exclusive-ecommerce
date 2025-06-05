import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useSelector(state => state.user)
  return user && user?.role === "admin" ? children : <Navigate to="/" />
}

export default AdminRoute
