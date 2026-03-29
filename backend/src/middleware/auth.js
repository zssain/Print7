const { auth, isFirebaseInitialized } = require('../config/firebase');

async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    if (!isFirebaseInitialized) {
      req.user = {
        uid: token.split('-')[0] || 'mock-user',
        email: token.includes('@') ? token : 'user@print7.com',
      };
      return next();
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message,
    });
  }
}

async function isAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!isFirebaseInitialized) {
      if (req.user.role === 'admin' || req.user.email === 'admin@print7.com') {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const userRecord = await auth.getUser(req.user.uid);
    if (userRecord.customClaims?.role === 'admin') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: error.message,
    });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    if (!isFirebaseInitialized) {
      req.user = {
        uid: token.split('-')[0] || 'mock-user',
        email: token.includes('@') ? token : 'user@print7.com',
      };
      return next();
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    } catch (error) {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  optionalAuth,
};
