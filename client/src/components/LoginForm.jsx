import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login method from context

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password); // Use AuthContext's login
      setSuccess(true);
      navigate("/payment");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-navy-900">Login</h2>

      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded-md">
          {error}
        </div>
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded-md"
        value={formData.password}
        onChange={handleChange}
      />

      <button
        type="submit"
        className={`w-full py-2 rounded-md text-white ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800'
        }`}
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}