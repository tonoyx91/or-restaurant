import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';
import OrderTracker from './components/OrderTracker';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<{ id: string; startTime: number } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/cart" 
            element={
              user ? (
                <Cart 
                  onOrderCreated={(orderId) => {
                    setActiveOrder({ id: orderId, startTime: Date.now() });
                    setTimeout(() => setActiveOrder(null), 180000);
                  }}
                />
              ) : (
                <Navigate to="/auth" />
              )
            } 
          />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>

      {activeOrder && (
        <OrderTracker 
          orderId={activeOrder.id}
          estimatedTime={3}
        />
      )}

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
