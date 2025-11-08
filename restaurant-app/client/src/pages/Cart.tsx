import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types';
import { NotificationService } from '../services/notification';
import OrderTracker from '../components/OrderTracker';

interface CartProps {
  onOrderCreated?: (orderId: string) => void;
}

export default function Cart({ onOrderCreated }: CartProps) {
  const { items, subtotal, clear, updateQty } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [orderId, setOrderId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const VAT_PERCENT = 5;
  const PLATFORM_FEE = 40;
  const DELIVERY_FEE = 60;

  const vat = +(subtotal * (VAT_PERCENT / 100)).toFixed(2);
  let total = subtotal + vat + PLATFORM_FEE + DELIVERY_FEE;
  const [discount, setDiscount] = useState(0);

  const applyVoucher = () => {
    if (voucherCode === 'SAVE23') {
      const discountAmount = +(total * 0.23).toFixed(2);
      setDiscount(discountAmount);
      total = +(total * 0.77).toFixed(2);
      NotificationService.success('Voucher applied: 23% off');
    } else {
      NotificationService.error('Invalid voucher code');
    }
  };

  const confirm = async () => {
    if (!address.trim() || !phone.trim()) {
      NotificationService.error('Please fill in delivery details');
      return;
    }
    
    setIsLoading(true);
    const payload = {
      items: items.map((i: CartItem) => ({ 
        food: i.id, 
        title: i.title, 
        price: i.price, 
        qty: i.qty 
      })),
      address,
      phone,
      voucher: voucherCode === 'SAVE23' ? { code: 'SAVE23', discountPercent: 23 } : null,
      paymentMethod: 'Cash'
    };

    try {
      const res = await API.post('/orders', payload);
      NotificationService.success('Order placed successfully!');
      setOrderId(res.data._id);
      onOrderCreated?.(res.data._id);
      setTimeout(() => {
        setOrderId(undefined);
        clear();
      }, 180000);
    } catch (err) {
      NotificationService.error('Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && !orderId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700">Your cart is empty</h3>
        <p className="text-gray-500 mt-2">Add some delicious items to your cart</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Your Cart</h2>
              {!orderId && items.length > 0 && (
                <button 
                  onClick={clear}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  Clear All
                </button>
              )}
            </div>

            {!orderId && (
              <div className="space-y-4 mb-6">
                {items.map((it: CartItem) => {
                  const qty = Number(it.qty ?? 0);
                  const price = Number(it.price ?? 0);
                  return (
                    <div key={it.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <h3 className="font-medium">{it.title}</h3>
                        <div className="text-orangebrand font-semibold">
                          Tk {(price * qty).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQty(it.id, qty - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{qty}</span>
                        <button 
                          onClick={() => updateQty(it.id, qty + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!orderId && (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Tk {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT ({VAT_PERCENT}%)</span>
                    <span>Tk {vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span>Tk {PLATFORM_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>Tk {DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- Tk {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>Tk {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    className="input-primary"
                    placeholder="Delivery Address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                  <input 
                    className="input-primary"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input 
                      className="input-primary flex-1"
                      placeholder="Voucher Code"
                      value={voucherCode}
                      onChange={e => setVoucherCode(e.target.value)}
                    />
                    <button 
                      onClick={applyVoucher}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                    >
                      Apply
                    </button>
                  </div>
                  <button
                    onClick={confirm}
                    disabled={!user || items.length === 0 || isLoading}
                    className={`w-full py-4 rounded-xl text-white font-medium
                      ${isLoading 
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orangebrand to-orange-500 hover:from-orange-600 hover:to-orange-700'}
                    `}
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {orderId && <OrderTracker orderId={orderId} />}
    </>
  );
}
