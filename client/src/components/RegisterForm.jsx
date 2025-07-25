import React, { useState } from "react";
import { registerUser } from "../services/backenInt";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    profileImage: null,
  });

  const [error, setError] = useState(null);      
  const [success, setSuccess] = useState(false); 

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      console.log("Registered:", res.data);
      setSuccess(true);
      setError(null);
     // 👇 redirect to payment after 1 second
      setTimeout(() => {
        navigate("/payment");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      setSuccess(false);
    }
  };

  return (
   <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto">
     <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Register to Dime Allies</h2>
      
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
      />

      <div>
        <label className="block mb-1 text-sm font-medium dark:text-gray-200">Upload Profile Image</label>
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition"
      >
        Register
      </button>
    </form>
  );
}
