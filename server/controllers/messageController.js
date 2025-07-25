const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { roomName, context, reactions, createdAt  } = req.body;

    const sender = req.user._id;
    const image = req.file ? req.file.filename : 'default-recipe.jpg';

    const newMessage = new Message({
      sender,
      roomName,
      context,
      image: image,
      reactions: reactions || [],
      createdAt,
    });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {("Send Message Error:", err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { roomName } = req.params; // get from URL
    const messages = await Message.find({ roomName })
      .populate('sender', 'fullName position profileImage') // add profileImage if needed
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};
