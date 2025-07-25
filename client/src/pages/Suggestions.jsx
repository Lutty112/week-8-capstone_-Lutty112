import { useState, useEffect } from "react";
import axios from "axios";
import SuggestionCard from "../components/SuggestionCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthContext user:", user);
    console.log("Token from localStorage:", localStorage.getItem("token"));
    console.log("User role:", user?.role);

    if (user === null && isLoading) {
      console.log("User state still loading, waiting...");
      return;
    }

    if (!user || !token) {
      console.log("User or token not authenticated, redirecting to /login");
      navigate("/login");
      return;
    }

    fetchSuggestions();
    setIsLoading(false);
  }, [user, token, navigate, isLoading, retryCount]);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("https://week-8-capstone-lutty112.onrender.com/api/suggestions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(res.data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching suggestions", err.response?.data || err.message);
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
        setError(`Failed to fetch suggestions: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }
    try {
      await axios.post(
        "https://week-8-capstone-lutty112.onrender.com/api/suggestions",
        { content: `${title}: ${description}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      setError(null);
      fetchSuggestions();
    } catch (err) {
      console.error("Error submitting suggestion", err.response?.data || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to submit suggestions. Contact an admin.");
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Unknown server error'}. Please try again later.`);
      } else {
        setError(`Failed to submit suggestion: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleUpvote = async (id) => {
    try {
      await axios.post(`https://week-8-capstone-lutty112.onrender.com/api/suggestions/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuggestions();
    } catch (err) {
      console.error("Error upvoting suggestion", err.response?.data || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("Upvote feature not available. Contact support.");
      } else if (err.response?.status === 500) {
        setError(`Server error: ${err.response?.data?.error || 'Unknown server error'}. Please try again later.`);
      } else {
        setError(`Failed to upvote suggestion: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (!user && isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-800 mb-4">Suggestions Board</h1>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Suggestion Title"
          className="w-full mb-2 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Explain your suggestion"
          className="w-full mb-3 p-2 border rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900"
        >
          Submit Suggestion
        </button>
      </div>

      {/* Suggestions List using SuggestionCard */}
      {suggestions.map((s) => (
        <SuggestionCard
          key={s._id}
          suggestion={{
            ...s,
            content: s.content,
            upvotes: s.upvotes ? s.upvotes.length : 0,
          }}
          onUpvote={handleUpvote}
        />
      ))}
    </div>
  );
}