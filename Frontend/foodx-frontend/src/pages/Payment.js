import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate payment
    setTimeout(() => {
      setLoading(false);
      navigate('/cart', { state: { paymentSuccess: true } });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Payment</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            maxLength={16}
            pattern="[0-9]{16}"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Expiry</label>
            <input
              type="text"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              placeholder="MM/YY"
              pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">CVC</label>
            <input
              type="text"
              value={cvc}
              onChange={e => setCvc(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              maxLength={4}
              pattern="[0-9]{3,4}"
              placeholder="123"
            />
          </div>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full btn-primary py-2 mt-4"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay & Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Payment;
