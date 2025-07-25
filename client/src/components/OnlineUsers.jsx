
export default function OnlineUsers({ users }) {
  return (
    <div className="absolute top-2 right-2 bg-white/70 backdrop-blur-md border rounded-xl px-3 py-2 shadow-md">
      <h2 className="text-xs font-bold text-purple-800 mb-1">Online Now</h2>
      <ul className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto">
        {users.map((user, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {user.fullName || user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
