import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { CartItem, Order } from '../types';

export default function Cart() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const VAT_PERCENT = 5;
  const PLATFORM_FEE = 40;

  const vat = +(subtotal * (VAT_PERCENT / 100)).toFixed(2);
  let total = subtotal + vat + PLATFORM_FEE;

  const applyVoucher = () => {
    // demo voucher SAVE23 => 23%
    if (voucherCode === 'SAVE23') {
      total = total * 0.77;
      setStatusMsg('Voucher applied: 23% off');
    } else setStatusMsg('Invalid voucher');
  };

  const confirm = async () => {
    const payload = {
      items: items.map((i: { id: any; title: any; price: any; qty: any; }) => ({ food: i.id, title: i.title, price: i.price, qty: i.qty })),
      address, phone, voucher: voucherCode === 'SAVE23' ? { code: 'SAVE23', discountPercent: 23 } : null,
      paymentMethod: 'Cash'
    };
    try {
      const res = await API.post('/orders', payload);
      setStatusMsg('Order created. Showing progress for ~3 minutes (demo).');
      // fake progress banner: create an interval that clears after 3 minutes
      setTimeout(() => { setStatusMsg('Order delivered! Please rate in Profile.'); clear(); }, 180000);
    } catch (err) { setStatusMsg('Failed to create order'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {items.map((it: CartItem) => {
            const qty = Number(it.qty ?? 0);
            const price = Number(it.price ?? 0);
            return (
              <div key={it.id} className="flex items-center justify-between mb-3 p-3 border rounded">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-600">Qty: {qty}</div>
                </div>
                <div> Tk {(price * qty).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border rounded">
          <div className="mb-2">Price: Tk {subtotal.toFixed(2)}</div>
          <div className="mb-2">VAT ({VAT_PERCENT}%): Tk {vat.toFixed(2)}</div>
          <div className="mb-2">Platform Fee: Tk {PLATFORM_FEE.toFixed(2)}</div>
          <div className="font-semibold mb-4">Total: Tk {total.toFixed(2)}</div>

          <input className="w-full mb-2 p-2 border" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
          <input className="w-full mb-2 p-2 border" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="w-full mb-2 p-2 border" placeholder="Voucher code" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} />
          <button className="btn-orange w-full mb-2" onClick={applyVoucher}>Apply Voucher</button>
          <button className="btn-orange w-full" onClick={confirm} disabled={!user || items.length===0}>Confirm Order</button>
          {statusMsg && <div className="mt-3 text-sm text-gray-700">{statusMsg}</div>}
        </div>
      </div>
    </div>
  );
}
