import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import ChatRoomSelection from "./pages/ChatRoomSelection";
import ChatRoom from "./pages/ChatRoom";
import Documents from "./pages/Documents";
import Polls from "./pages/Polls";
import Events from "./pages/Events";
import Suggestions from "./pages/Suggestions";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Dashboard />} />

          {/* Protected Routes with Shared Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
            <Route path="/payment" element={<Payment />} />
            <Route path="/chatroom-selection" element={<ChatRoomSelection />} />
            <Route path="/chatroom/:roomName" element={<ChatRoom />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/events" element={<Events />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
