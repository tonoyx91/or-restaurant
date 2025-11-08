import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orangebrand to-orangelight 
            text-white flex items-center justify-center font-bold text-xl transform 
            transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            OR
          </div>
          <span className="font-bold text-xl gradient-text">Restaurant</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-orangebrand transition-colors">Home</Link>
          <Link to="/" className="text-gray-600 hover:text-orangebrand transition-colors">Menu</Link>
          {items.length > 0 && (
            <Link to="/cart" className="relative group">
              <span className="text-gray-600 hover:text-orangebrand transition-colors font-medium">
                Cart
              </span>
              <span className="absolute -top-3 -right-3 bg-orangebrand text-white text-xs 
                w-5 h-5 rounded-full flex items-center justify-center transform transition-transform 
                group-hover:scale-110">
                {items.length}
              </span>
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-orangebrand transition-colors">
                Profile
              </Link>
              <button onClick={logout} 
                className="text-red-500 hover:text-red-600 transition-colors font-medium
                hover:bg-red-50 px-4 py-2 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-orange">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
