import { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import { socket } from '../services/backenInt';
import MessageBubble from "../components/MessageBubble";
import ImageUploader from "../components/ImageUploader";
import OnlineUsers from "../components/OnlineUsers";
import API from '../services/backenInt';
import { FaRegSmile } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import LeadersCorner from "../assets/LeadersCorner.jpg";
import GeneralRoom from "../assets/GeneralRoom.jpg";

export default function ChatRoom() {
  const { user: currentUser, logout } = useAuth();
  const { roomName } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
     console.log("useEffect triggered with roomName:", roomName);

    if (!roomName || !currentUser?._id) return;

   socket.emit("joinRoom", { roomName, userId: currentUser._id });

   API.get(`/messages/${roomName}`)
     .then((res) => {
    console.log("Fetched messages:", res.data); // ✅ ADD THIS
    setMessages(res.data);
  })
     .catch((err) => console.error("Fetch messages error:", err));

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
       const withoutTemp = prev.filter((m) => m._id !== msg._id && !(typeof m._id === 'string' && m._id.length === 13));
       return [...withoutTemp, msg];
   });
  });

    socket.on("typing", ({ senderName }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(senderName)) return [...prev, senderName];
        return prev;
      });
    });

    socket.on("stopTyping", ({ senderName }) => {
      setTypingUsers((prev) => prev.filter((name) => name !== senderName));
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("messageReaction", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });

    return () => {
      socket.emit("leaveRoom", { roomName, userId: currentUser._id });
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("onlineUsers");
      socket.off("messageReaction");
    };
  }, [roomName, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);

    socket.emit("typing", {
      roomName,
      senderName: currentUser.fullName,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        roomName,
        senderName: currentUser.fullName,
      });
    }, 1500);
  };

  const handleSend = () => {
  if (!input.trim()) return;

  const tempId = Date.now().toString(); // Temporary ID to avoid duplication
  const optimisticMsg = {
    _id: tempId,
    roomName: roomName,
    context: input,
    image: previewImage,
    sender: currentUser, // Include full user info for now
    createdAt: new Date().toISOString(),
    reactions: []
  };

  // Optimistically add to messages
  setMessages((prev) => [...prev, optimisticMsg]);


    socket.emit("sendMessage", {
    ...optimisticMsg,
    sender: currentUser._id, // send only userId to backend
  });

  setInput("");
  setPreviewImage("");
};

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const onReact = (emoji, messageId) => {
    socket.emit("reactToMessage", {
      messageId,
      userId: currentUser._id,
      emoji,
    });
  };

  const getBackgroundImage = () => {
    if (roomName === "GeneralRoom") return `url(${GeneralRoom})`;
    if (roomName === "Leaders-Corner") return `url(${LeadersCorner})`;
    return "none";
  };

  return (
    <div 
      className="flex flex-col h-screen relative"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0  bg-opacity-60" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        <OnlineUsers users={onlineUsers} currentRoom={roomName} />
        
        <div className="flex-1 flex flex-col p-4 bg-white/10 rounded-lg shadow-lg m-2">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-purple-700 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                console.log("Rendering message:", msg);
                return (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    isOwn={
                           typeof msg.sender === "object"
                           ? msg.sender._id === currentUser._id
                           : msg.sender === currentUser._id
                          }
                    onReact={onReact}
                  />
                );
              })
            )}
            {typingUsers.length > 0 && (
              <p className="text-sm text-white italic bg-black bg-opacity-50 px-2 py-1 rounded">
                {typingUsers.join(", ")} typing...
              </p>
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div className="flex items-center gap-2 mt-4 bg-white bg-opacity-90 p-2 rounded-lg">
            <ImageUploader room={roomName} sender={currentUser}
              onSend={(imageMessage) => setMessages((prev) => [...prev, imageMessage])} />
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button onClick={() => setShowEmojis(!showEmojis)}>
              <FaRegSmile className="text-2xl text-purple-600 hover:text-purple-800" />
            </button>
            <button
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors" >
              Send
            </button>
             </div>
              
          {showEmojis && (
            <div className="mt-2 bg-white bg-opacity-95 p-2 rounded shadow flex gap-2 flex-wrap">
              {["❤️", "😂", "👍", "😢", "😊", "😍", "🎉", "🔥", "💯", "🙏", "😎","👅", "🌮", "💦","😘","😛","🥵","👀" ].map((emoji) => (
                <button 
                  key={emoji} 
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl hover:bg-gray-200 p-1 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}