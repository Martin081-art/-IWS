import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading...</p>;

  const handleGoToDashboard = () => {
    switch (user.role) {
      case 'admin':
      case 'developer':
        navigate('/admin-dashboard');
        break;
      case 'sales':
        navigate('/sales-dashboard');
        break;
      case 'finance':
        navigate('/finance-dashboard');
        break;
      case 'investor':
        navigate('/investor-dashboard');
        break;
      case 'customer':
        navigate('/shop');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow-md rounded-md text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
      <p className="mb-4">You are logged in as <strong>{user.role}</strong>.</p>
      <button
        onClick={handleGoToDashboard}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default WelcomePage;
