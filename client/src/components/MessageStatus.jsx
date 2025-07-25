// components/MessageStatus.jsx
export default function MessageStatus({ status }) {
  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return "✅";
      case "delivered":
        return "✅✅";
      case "seen":
        return "👀";
      default:
        return "";
    }
  };

  return (
    <span className="text-xs text-gray-500 ml-2">
      {getStatusIcon()}
    </span>
  );
}
