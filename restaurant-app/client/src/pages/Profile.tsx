import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notification';

interface Order {
  _id: string;
  items: Array<{
    title: string;
    price: number;
    qty: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  rating?: number;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchUserDetails();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch (err) {
      NotificationService.error('Failed to fetch orders');
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await API.get('/auth/profile');
      setUserDetails(res.data);
    } catch (err) {
      NotificationService.error('Failed to fetch profile');
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      await API.put('/auth/profile', userDetails);
      NotificationService.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      NotificationService.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (orderId: string) => {
    try {
      await API.post(`/orders/${orderId}/rate`, { rating });
      NotificationService.success('Rating submitted successfully');
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders to update ratings
    } catch (err) {
      NotificationService.error('Failed to submit rating');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Profile</h2>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-orangebrand hover:text-orangedark"
                >
                  Edit
                </button>
              ) : (
                <button 
                  onClick={updateProfile}
                  className="text-green-500 hover:text-green-600"
                  disabled={loading}
                >
                  Save
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  className="input-primary"
                  value={userDetails.name}
                  onChange={e => setUserDetails({ ...userDetails, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  className="input-primary"
                  value={userDetails.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input
                  className="input-primary"
                  value={userDetails.phone}
                  onChange={e => setUserDetails({ ...userDetails, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <textarea
                  className="input-primary"
                  value={userDetails.address}
                  onChange={e => setUserDetails({ ...userDetails, address: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-2xl font-bold gradient-text mb-6">Order History</h2>
            
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-100 rounded-lg p-4 hover:shadow-soft transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold">
                        Order #{order._id.slice(-6)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()} 
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      Tk {order.total.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        {item.qty}x {item.title}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                        'bg-orange-100 text-orangebrand'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {order.status === 'delivered' && !order.rating && (
                      <button
                        onClick={() => setSelectedOrder(order._id)}
                        className="text-sm text-orangebrand hover:text-orangedark"
                      >
                        Leave Rating
                      </button>
                    )}

                    {order.rating && (
                      <div className="flex items-center text-yellow-400">
                        {'★'.repeat(order.rating)}
                        <span className="ml-1 text-sm text-gray-600">
                          ({order.rating}/5)
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedOrder === order._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Rate your order</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={rating}
                          onChange={e => setRating(Number(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-yellow-400 font-medium">
                          {rating}/5
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitRating(order._id)}
                          className="px-3 py-1 text-sm bg-orangebrand text-white rounded-lg hover:bg-orangedark"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
