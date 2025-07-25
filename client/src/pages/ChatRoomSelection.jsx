import { useNavigate } from "react-router-dom";

const ChatRoomSelection = () => {
  const navigate = useNavigate();

  const handleJoin = (roomName) => {
    navigate(`/chatroom/${roomName}`);
  };

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col p-6">
      <h1 className="text-4xl font-bold text-purple-700 mb-2">Join a Chat Room</h1>
      <p className="text-gray-700 text-lg mb-8">
        Collaborate, discuss, and grow together with fellow Dime Allies.
      </p>

      <div className="grid md:grid-cols-2 gap-10 max-w-4xl w-full">
        {/* General Room */}
        <div
          onClick={() => handleJoin("GeneralRoom")}
          className="relative rounded-3xl shadow-lg cursor-pointer hover:shadow-xl transition p-8 bg-white text-center"
          style={{ minHeight: "220px" }}
        >
          <h2 className="text-3xl text-purple-700 font-semibold mb-2">General Room</h2>
          <p className="mb-6">
            Open chat for all members to communicate, connect, share advice, ask questions, or say hello.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleJoin("GeneralRoom");
            }}
            className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition"
          >
            Join Room
          </button>
        </div>

        {/* Leaders' Corner */}
        <div
          onClick={() => handleJoin("Leaders-Corner")}
          className="relative rounded-3xl shadow-lg cursor-pointer hover:shadow-xl transition p-8 bg-white text-center"
          style={{ minHeight: "220px" }}
        >
          <h2 className="text-3xl text-purple-700 font-semibold mb-2">Leaders' Corner</h2>
          <p className="mb-6">
            For executives and committee members to plan, review, and manage key decisions.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleJoin("Leaders-Corner");
            }}
            className="bg-purple-700 text-white px-6 py-2 rounded-full hover:bg-purple-800 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomSelection;
