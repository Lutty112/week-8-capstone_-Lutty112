const jwt = require('jsonwebtoken');
const User = require('../models/User');

 
exports.protect = async (req, res, next) => {
const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token Given" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// Checks role
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden"});
        next();
    };
};


