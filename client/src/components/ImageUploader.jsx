import { useRef, useState } from "react";
import axios from "axios";
import { socket } from "../services/backenInt";

  const ImageUploader = ({ room, sender, onSend }) => {
  const fileRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const backendUrl = "http://localhost:5000"; // Adjust if needed

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${backendUrl}/api/messages/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.url.startsWith("http")
        ? res.data.url
        : `${backendUrl}${res.data.url}`;

      const message = {
        _id: Date.now().toString(), // temporary ID
        chatRoom: room,
        sender,
        context: "",
        image: imageUrl,
        createdAt: new Date().toISOString(),
        reactions: [],
      };

      socket.emit("sendMessage", {
        ...message,
        sender: sender._id,
      });

      // ✅ Immediately show the image in chat
      if (onSend) onSend(message);

      setPreviewImage(null); 
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <button
        onClick={() => fileRef.current.click()}
        className="text-xl hover:scale-110 transition-transform duration-150"
        title="Upload Image"
      >
        📷
      </button>

      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className="max-w-xs mt-2 rounded-lg"
        />
      )}
    </div>
  );
};

export default ImageUploader;