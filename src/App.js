import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import ProductsPage from './pages/ProductsPage';
import PrivateRoute from './components/PrivateRoute';
import IncomePage from './pages/IncomePage';
import QueryForm from './components/QueryForm';
import QueriesPage from './pages/QueriesPage';
import WelcomePage from './pages/WelcomePage';
import CustomerShopPage from './pages/CustomerShopPage';
import CartPage from './pages/CartPage';
import SalesPage from './pages/SalesPage';
import ReportPage from './pages/ReportPage'; // ✅ Import the Report Page
import { CartProvider } from './context/CartContext';
import './App.css';
import Analytics from './components/Analytics';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <CartProvider>
        {user && <Navbar />}

        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'customer' ? (
                  <Navigate to="/shop" />
                ) : (
                  <Navigate to="/products" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute requiredRole={['sales', 'admin', 'customer', 'developer' ]}>
                <ProductsPage />
              </PrivateRoute>
            }
          />

          <Route path="/welcome" element={<WelcomePage />} />

          <Route
            path="/queries"
            element={
              <PrivateRoute requiredRole={['sales', 'admin']}>
                <QueriesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/income"
            element={
              <PrivateRoute requiredRole={['finance', 'admin', 'investor', 'developer']}>
                <IncomePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/shop"
            element={
              <PrivateRoute requiredRole="customer">
                <CustomerShopPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute requiredRole="customer">
                <CartPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/query"
            element={user ? <QueryForm /> : <Navigate to="/login" />}
          />

          <Route path="/login" element={<LoginForm />} />

          <Route
            path="/sales"
            element={
              <PrivateRoute requiredRole={['sales', 'admin', 'developer']}>
                <SalesPage />
              </PrivateRoute>
            }
          />

          <Route path="/analytics" element={<Analytics />} />

          {/* ✅ Route for Report Page accessible by 'sales' and 'admin' */}
          <Route
            path="/report"
            element={
              <PrivateRoute requiredRole={['sales', 'admin']}>
                <ReportPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
