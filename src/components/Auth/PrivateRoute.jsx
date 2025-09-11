import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // ユーザーがログインしていない場合、ログインページにリダイレクト
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
