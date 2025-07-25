import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes("/chatroom");

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col p-4 shadow-md">
      <h2 className="text-lg font-bold text-purple-700 mb-4">Navigation</h2>

      {/* ✅ Show navigation links always */}
      <nav className="flex flex-col gap-3">
        <NavLink to="/payment" className="hover:text-purple-900">💰 Payment</NavLink>
        <NavLink to="/chatroom-selection" className="hover:text-purple-900">💬 Chat Rooms</NavLink>
        <NavLink to="/documents" className="hover:text-purple-900">📄 Documents</NavLink>
        <NavLink to="/polls" className="hover:text-purple-900">📊 Polls</NavLink>
        <NavLink to="/events" className="hover:text-purple-900">📅 Events</NavLink>
        <NavLink to="/suggestions" className="hover:text-purple-900">💡 Suggestions</NavLink>
      </nav>

      
    </aside>
  );
};

export default Sidebar;
