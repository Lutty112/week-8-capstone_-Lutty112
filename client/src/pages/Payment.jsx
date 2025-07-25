import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Payment() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('M-Pesa');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      console.log('User not authenticated, redirecting to /login');
      navigate('/login');
      return;
    }

    const fetchPaymentHistory = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://week-8-capstone-lutty112.onrender.com/api';
        const res = await axios.get(`${apiUrl}/payments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Payment history response:', res.data);
        setPaymentHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch payment history:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load payment history');
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [user, token, navigate, logout]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || !method) {
      setError('Amount and method are required');
      return;
    }

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      amount: parseInt(amount),
      paymentMethod: method, // Align with backend
      status: 'pending',
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://week-8-capstone-lutty112.onrender.com/api';
      const res = await axios.post(
        `${apiUrl}/payments`,
        { amount: parseInt(amount), method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Payment response:', res.data);
      setPaymentHistory([res.data, ...paymentHistory]);
      setAmount('');
      setError('');
    } catch (err) {
      console.error('Payment error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Payment failed');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-4">Payments</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <main className="flex-1 overflow-y-auto p-6 space-y-10">
        <section className="bg-purple-100 dark:bg-gray-800 p-6 rounded-2xl shadow-inner text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">💰 About Payments & Investment in Dime Allies</h2>
          <p className="mb-4">
            At Dime Allies, each member commits to investing a minimum of <strong>5 shares (equal to 50,000 TZS or more),</strong> contributed over a 12-month period. This initiative promotes discipline, growth, and purpose-driven financial planning.
          </p>
          <p className="mb-4">
            At the end of the year, members can choose to:
            <ol className="list-decimal ml-6">
              <li>Withdraw their investment to fund personal goals and dreams.</li>
              <li>Reinvest to continue building long-term financial security.</li>
            </ol>
          </p>
          <p className="mb-4">
            ✨ New members join by contributing <strong>2 shares (20,000 TZS)</strong> as an entry fee—a welcoming step into a supportive community that thrives on mutual trust and vision.
          </p>
          <p className="mb-4">
            💡 Once inside, you’ll discover incredible planning tools, support systems, and empowering activities designed to elevate your financial journey.
          </p>
          <p className="mb-4">
            ❤️ At Dime Allies, <strong>we value you. We honor your growth.</strong> Show us your commitment and know that you are supported and celebrated here.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Initiate a Payment</h2>
          <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (TZS)"
              className="px-4 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-4 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600"
              required
            >
              <option value="M-Pesa">M-Pesa</option>
              <option value="Tigo Pesa">Tigo Pesa</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Halopesa">Halopesa</option>
              <option value="NMB">NMB Bank</option>
              <option value="CRDB">CRDB Bank</option>
            </select>
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition"
            >
              Pay Now
            </button>
          </form>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-purple-100 dark:bg-gray-700 text-left">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-600">
                {Array.isArray(paymentHistory) && paymentHistory.length > 0 ? (
                  paymentHistory.map(({ createdAt, amount, paymentMethod, status }, i) => (
                    <tr key={i}>
                      <td className="p-3">{createdAt ? new Date(createdAt).toISOString().split('T')[0] : 'N/A'}</td>
                      <td className="p-3">{amount.toLocaleString()} TZS</td>
                      <td className="p-3">{paymentMethod}</td>
                      <td className="p-3 text-green-600 font-semibold">{status || 'Pending'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-3 text-center">No payment history available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}