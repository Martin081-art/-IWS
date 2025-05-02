import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current user in Navbar:", user);
  }, [user]);

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <ul className="flex space-x-4 bg-gray-800 text-white p-4">
        

        {user && (
          <>
            {(user.role === 'admin' || user.role === 'developer') && (
              <li>
                <Link to="/products" className="hover:text-gray-400">
                  Products
                </Link>
              </li>
            )}

            {(user.role === 'admin' || user.role === 'finance' || user.role === 'investor' || user.role === 'developer') && (
              <li>
                <Link to="/income" className="hover:text-gray-400">
                  Income
                </Link>
              </li>
            )}

            {(user.role === 'admin' || user.role === 'developer') && (
              <li>
                <Link to="/report" className="hover:text-gray-400">
                  Queries
                </Link>
              </li>
            )}

            {(user.role === 'sales') && (
              <>
                <li>
                  <Link to="/sales" className="hover:text-gray-400">
                    Sales
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="hover:text-gray-400"> {/* New ReportPage link */}
                    Report
                  </Link>
                </li>
              </>
            )}

            {user.role === 'customer' && (
              <>
                <li>
                  <Link to="/query" className="hover:text-gray-400">
                    Submit Query
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-gray-400">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-gray-400">
                    View Cart
                  </Link>
                </li>
              </>
            )}
          </>
        )}

        <li className="ml-auto">
          {user ? (
            <button onClick={handleLogout} className="hover:text-gray-400">
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:text-gray-400">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
