import { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthContext user:", user);
    const token = user?.token || localStorage.getItem("token");
    console.log("Token:", token);

    if (!user || !token) {
      console.log("User or token missing, redirecting to /login");
      navigate("/login");
      return;
    }

    fetchEvents(token);
  }, [user, retryCount, navigate]);

  const fetchEvents = async (token) => {
    try {
      console.log("Fetching events with token:", token);
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error("Failed to fetch events:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Unknown server error'}. Retrying...`);
        if (retryCount < 3) {
          setTimeout(() => setRetryCount(retryCount + 1), 2000);
        } else {
          setError(`Server error persists: ${err.response?.data?.error || 'Unknown server error'}. Please try again later.`);
        }
      } else {
        setError(`Failed to fetch events: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleCreate = async () => {
    if (!title || !date || !description || !location) {
      setError("All fields are required");
      return;
    }
    try {
      const token = user?.token || localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/events",
        { title, date, description, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDate("");
      setDescription("");
      setLocation("");
      setError(null);
      fetchEvents(token);
    } catch (err) {
      console.error("Error creating event:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Unknown server error'}. Please try again later.`);
      } else {
        setError(`Failed to create event: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleAttend = async (eventId) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/attend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents(token);
    } catch (err) {
      console.error("Error joining event:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Unknown server error'}. Please try again later.`);
      } else {
        setError(`Failed to join event: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (!user) {
    return <div className="p-6">Please log in to view events</div>;
  }

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-800 mb-4">Dime Allies Events</h1>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Event Title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          className="w-full mb-2 p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Event Location"
          className="w-full mb-2 p-2 border rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <textarea
          placeholder="Event Description"
          className="w-full mb-3 p-2 border rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          onClick={handleCreate}
          className="bg-purple-700 text-white px-4 py-2 rounded shadow hover:bg-purple-900"
        >
          Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onJoin={() => handleAttend(event._id)}
          />
        ))
      )}
    </div>
  );
}