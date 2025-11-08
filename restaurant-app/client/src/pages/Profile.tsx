import React, { useState } from 'react';
import API from '../api';

export default function Profile() {
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState('');
  const submit = async () => {
    // demo: in a real app you'd POST rating to server
    setMsg('Thanks for your rating!');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="p-4 border rounded max-w-md">
        <h3 className="font-medium">Leave a rating after delivery</h3>
        <input type="range" min={1} max={5} value={rating} onChange={e => setRating(Number(e.target.value))} />
        <div className="mb-2">Rating: {rating}</div>
        <button className="btn-orange" onClick={submit}>Submit Rating</button>
        {msg && <div className="mt-2 text-green-600">{msg}</div>}
      </div>
    </div>
  );
}
