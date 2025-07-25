const { Server } = require('socket.io');
const Message = require('../models/Message');

const onlineUsers = new Map(); 

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('⚡ New user connected:', socket.id);

    // ✅ Handle room joining and track online users
    socket.on('joinRoom', ({ roomName, userId }) => {
      socket.join(roomName);
      
      // Store user info with socket
      onlineUsers.set(socket.id, { userId, roomName });
      console.log(`User ${userId} joined room ${roomName}. Online count: ${onlineUsers.size}`);

      // Send updated online users list to the room
      const roomUsers = Array.from(onlineUsers.values()).filter(user => user.roomName === roomName);
      io.to(roomName).emit('onlineUsers', roomUsers);
    });

    // ✅ Handle leaving room
    socket.on('leaveRoom', ({ roomName, userId }) => {
      socket.leave(roomName);
      onlineUsers.delete(socket.id);
      
      // Send updated online users list to the room
      const roomUsers = Array.from(onlineUsers.values()).filter(user => user.roomName === roomName);
      io.to(roomName).emit('onlineUsers', roomUsers);
      
      console.log(`User ${userId} left room ${roomName}`);
    });

    // ✅ Send and Save Message (matches frontend sendMessage event)
    socket.on('sendMessage', async (data) => {
      try {
        const { roomName, context, image, sender, createdAt } = data;

        const message = await Message.create({
          roomName,
          sender,
          context,
          image: image || null,
          reactions: [],
          createdAt: createdAt || new Date().toISOString(),
        });

        const fullMessage = await message.populate('sender', 'fullName profileImage');
        io.to(roomName).emit('receiveMessage', fullMessage);
      } catch (error) {
        console.error('Error sending message:', error.message);
      }
    });

    // ✅ Typing indicators (matches frontend events)
    socket.on('typing', ({ roomName, senderName }) => {
      socket.to(roomName).emit('typing', { senderName });
    });

    socket.on('stopTyping', ({ roomName, senderName }) => {
      socket.to(roomName).emit('stopTyping', { senderName });
    });

    // ✅ React to message (matches frontend reactToMessage event)
    socket.on('reactToMessage', async ({ messageId, userId, emoji }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) return;

        // Check if user already reacted with this emoji
        const existingReaction = message.reactions.find(
          r => r.user.toString() === userId && r.emoji === emoji
        );

        if (existingReaction) {
          // Remove reaction if it exists
          message.reactions = message.reactions.filter(
            r => !(r.user.toString() === userId && r.emoji === emoji)
          );
        } else {
          // Add new reaction
          message.reactions.push({ user: userId, emoji });
        }

        await message.save();

        const populated = await message.populate('sender', 'fullName profileImage');
        io.to(message.roomName).emit('messageReaction', populated);
      } catch (error) {
        console.error('Error reacting to message:', error.message);
      }
    });

    // ✅ Disconnect
    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);

      if (user && user.roomName) {
        // Send updated online users list to the room
        const roomUsers = Array.from(onlineUsers.values()).filter(u => u.roomName === user.roomName);
        io.to(user.roomName).emit('onlineUsers', roomUsers);
      }

      console.log(`User ${user?.userId || socket.id} disconnected. Online left: ${onlineUsers.size}`);
    });
  });
};