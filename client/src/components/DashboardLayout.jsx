import { useAuth  } from "../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet,  useNavigate } from "react-router-dom";

export default function DashboardLayout() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
    console.log("User is logging out...");
    localStorage.removeItem("user");
    setUser(null); // clear context state if you're storing it
    navigate("/");
    window.location.reload(); // optional full reset
  };
  return (
    <div className="min-h-screen bg-purple-100 flex flex-col">
       <Navbar user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
