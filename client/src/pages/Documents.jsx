import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DocumentCard from "@/components/DocumentCard";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const fileInputRef = useRef();
  const { user, token, logout } = useAuth(); // Add token and logout
  const navigate = useNavigate(); // Add useNavigate for redirects

  useEffect(() => {
    console.log('AuthContext user:', user);
    console.log('AuthContext token:', token);
    console.log('Token from localStorage:', localStorage.getItem('token'));

    if (user === null && isLoading) {
      console.log('User state still loading, waiting...');
      return;
    }

    if (!user || !token) {
      console.log('User or token not authenticated, redirecting to /login');
      navigate('/login');
      return;
    }

    fetchDocs();
    setIsLoading(false);
  }, [user, token, navigate, isLoading]);

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`https://week-8-capstone-lutty112.onrender.com/api/documents`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from useAuth
        },
      });
      console.log("Documents API response:", res.data);
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching docs", err.response?.data || err.message);
      if (err.response?.status === 401) {
        console.log('Unauthorized, logging out and redirecting to /login');
        logout();
        navigate('/login');
      }
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", file.name);

    try {
      await axios.post(`https://week-8-capstone-lutty112.onrender.com/api/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Use token from useAuth
        },
      });
      fetchDocs();
    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      if (err.response?.status === 401) {
        console.log('Unauthorized, logging out and redirecting to /login');
        logout();
        navigate('/login');
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
      <h1 className="text-2xl font-bold text-purple-800 mb-4">Shared Documents</h1>
      
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-purple-700 text-white px-4 py-2 rounded shadow hover:bg-purple-900"
        >
          Upload New Document
        </button>
      </div> 
      
      <div className="space-y-3">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            doc={{
              title: doc.title,
              fileType: doc.fileType || 'Unknown',
              url: doc.fileUrl,
            }}
          />
        ))}
      </div>
    </div>
  );
}