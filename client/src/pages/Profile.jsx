import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Added for debugging
        if (!token) {
          setError("No token found. Please log in.");
          navigate("/login");
          return;
        }
        const res = await axios.get("https://week-8-capstone-lutty112.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data); // Changed from res.data.user to res.data
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError(`Failed to load profile: ${err.response?.data?.message || err.message}`);
        }
      }
    };

    fetchProfile();
  }, [navigate, logout]);

  if (!user && !error) return <div className="p-4 text-gray-600">Loading profile...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-6">
      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4">
          {error}
        </div>
      )}
      {user && (
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-purple-500 object-cover"
          />
          <h2 className="text-2xl font-bold text-purple-700">{user.name}</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Role: {user.role}</p>
          <p className="text-sm text-gray-500 mt-2">User ID: {user._id}</p>
          <p className="text-sm text-gray-500 mt-2">Phone Number: {user.phone}</p>
        </div>
      )}
    </div>
  );
}