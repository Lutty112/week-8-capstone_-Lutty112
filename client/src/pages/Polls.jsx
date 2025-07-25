import { useState, useEffect } from "react";
import axios from "axios";
import PollCard from "../components/PollCard"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state for UI feedback
  const { user, token, logout } = useAuth(); // Add useAuth
  const navigate = useNavigate(); // Add useNavigate

  useEffect(() => {
    console.log("AuthContext user:", user);
    console.log("Token from localStorage:", localStorage.getItem("token"));
    console.log("User role:", user?.role); // Log role for debugging

    if (user === null && isLoading) {
      console.log("User state still loading, waiting...");
      return;
    }

    if (!user || !token) {
      console.log("User or token not authenticated, redirecting to /login");
      navigate("/login");
      return;
    }

    fetchPolls();
    setIsLoading(false);
  }, [user, token, navigate, isLoading]);

  const fetchPolls = async () => {
    try {
      const res = await axios.get("/api/polls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(res.data);
    } catch (err) {
      console.error("Error fetching polls", err.response?.data || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await axios.post(`/api/polls/${pollId}/vote`, { optionIndex }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls(); // Refresh polls
    } catch (err) {
      console.error("Voting error", err.response?.data || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handlePollSubmit = async () => {
    try {
      const filteredOptions = options.filter((o) => o.trim());
      if (!question.trim() || filteredOptions.length < 2) {
        setError("Poll question and at least two options are required.");
        return;
      }

      await axios.post("/api/polls", { question, options: filteredOptions }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion("");
      setOptions(["", ""]);
      setError(null);
      fetchPolls();
    } catch (err) {
      console.error("Poll creation failed", err.response?.data || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to create polls. Contact an admin.");
      } else {
        setError("Failed to create poll. Please try again.");
      }
    }
  };

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]); // 🔄 moved here inside component

  if (!user && isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-800 mb-4">Polls & Voting</h1>
      
      {/* Create Poll */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded-md mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Poll Question"
          className="w-full mb-3 p-2 border rounded"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            className="w-full mb-2 p-2 border rounded"
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, i)}
          />
        ))}

        <div className="flex gap-3 mt-2">
          <button onClick={addOption} className="text-sm text-blue-600">
            ➕ Add Option
          </button>
          <button
            onClick={handlePollSubmit}
            className="bg-purple-700 text-white px-4 py-2 rounded shadow hover:bg-purple-900"
          >
            Create Poll
          </button>
        </div>
      </div>

      {/* List Polls */}
      {polls.map((poll) => (
        <div key={poll._id} className="bg-white p-4 rounded shadow mb-4">
          <h2 className="text-lg font-bold mb-2">{poll.question}</h2>
          {poll.options.map((opt, i) => (
            <button
              key={i}
              className="w-full text-left border p-3 rounded-lg mb-2 hover:bg-purple-100"
              onClick={() => handleVote(poll._id, i)}
            >
              <span>{opt.text}</span>
              <span className="text-sm text-gray-600 ml-2">{opt.votes} votes</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}