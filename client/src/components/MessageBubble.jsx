import { useState } from "react";
import UserAvatar from "./UserAvatar";
import ReactionPicker from "./ReactionPicker";
import MessageStatus from "./MessageStatus";



export default function MessageBubble({ message, isOwn, onReact }) {
  const [showReactions, setShowReactions] = useState(false);
  const isImage = message.image && message.image !== "default-recipe.jpg";

  console.log("MessageBubble received message:", message);
  console.log("isOwn:", isOwn);

  const handleReaction = (emoji) => {
    if (onReact) {
      onReact(emoji, message._id);
    }
    setShowReactions(false);
  };

  // Handle both object sender and string sender ID
  const senderName = typeof message.sender === 'object' 
    ? message.sender?.fullName 
    : 'User'; // Fallback since we only have sender ID

  const senderImage = typeof message.sender === 'object' 
    ? message.sender?.profileImage 
    : null;

  return (
    <div className={`flex items-start gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <UserAvatar src={senderImage || '/default-avatar.png'}  alt={senderName} />

      <div className={`max-w-xs ${isOwn ? 'items-end' : 'items-start'}`}>
        <p className={`text-sm font-semibold mb-1 ${isOwn ? 'text-right' : ''}`}>
          {senderName}
        </p>

        {isImage && (
          <img src={message.image.startsWith("http") ? message.image : `https://week-8-capstone-lutty112.onrender.com/api${message.image}`} alt="Shared" className="w-60 rounded-lg my-1"
          />

        )}

        <div className={`px-3 py-2 rounded-lg shadow ${
          isOwn 
            ? 'bg-purple-500 text-white' 
            : 'bg-white text-gray-800'
        }`}>
          <p>{message.context}</p>
        </div>

        <div className={`flex items-center justify-between text-xs text-gray-400 mt-1 ${
          isOwn ? 'flex-row-reverse' : ''
        }`}>
          <MessageStatus createdAt={message.createdAt} />
          <ReactionPicker
            show={showReactions}
            onToggle={() => setShowReactions(!showReactions)}
            onSelect={handleReaction}
          />
        </div>

        {message.reactions?.length > 0 && (
          <div className="mt-1 flex gap-1 flex-wrap text-sm">
            {message.reactions.map((r, i) => (
              <span key={i} className="bg-purple-100 px-2 py-0.5 rounded-full">
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
