const jwt = require('jsonwebtoken');
const User = require('../Model/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Token verify karna
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User dhoondna (Payload mein 'id' bhej rahe hain hum)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user; // Ab req.user._id available hoga controller mein
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

//Admin ke liye middleware
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin Auth Error:', error.message);
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = { auth, adminAuth };