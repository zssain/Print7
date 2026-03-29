const { db, auth, isFirebaseInitialized } = require('../config/firebase');
const mockDb = require('../data/mockDb');
const { v4: uuidv4 } = require('uuid');
const { formatUserResponse, sanitizeObject } = require('../utils/helpers');
const { HTTP_STATUS, USER_ROLES } = require('../utils/constants');

async function registerUser(req, res) {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    let userId;
    let user = {};

    if (isFirebaseInitialized) {
      const existingUser = await mockDb.getUserByEmail(email);
      if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      try {
        const userRecord = await auth.createUser({
          email,
          password,
          displayName: `${firstName} ${lastName}`,
        });
        userId = userRecord.uid;
      } catch (authError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Failed to create user account',
          error: authError.message,
        });
      }

      user = {
        email,
        firstName,
        lastName,
        phone: phone || '',
        role: USER_ROLES.USER,
        address: {},
      };

      await db.collection('users').doc(userId).set({
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      userId = uuidv4();

      const existingUser = await mockDb.getUserByEmail(email);
      if (existingUser) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: 'User with this email already exists',
        });
      }

      user = {
        email,
        password,
        firstName,
        lastName,
        phone: phone || '',
        role: USER_ROLES.USER,
        address: {},
      };

      await mockDb.addUser(userId, user);
    }

    const response = {
      id: userId,
      ...user,
    };

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: formatUserResponse(response),
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (isFirebaseInitialized) {
      try {
        const user = await auth.getUserByEmail(email);

        const doc = await db.collection('users').doc(user.uid).get();
        if (!doc.exists) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: 'User not found',
          });
        }

        const userData = { id: user.uid, ...doc.data() };

        return res.status(HTTP_STATUS.OK).json({
          success: true,
          message: 'Login successful',
          data: {
            user: formatUserResponse(userData),
            message:
              'For production, use Firebase Authentication SDK on client',
          },
        });
      } catch (authError) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
    } else {
      const user = await mockDb.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        data: {
          user: formatUserResponse(user),
          token: `mock-token-${user.id}`,
        },
      });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
}

async function getUserProfile(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    let user;
    if (isFirebaseInitialized) {
      const doc = await db.collection('users').doc(userId).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
      user = { id: doc.id, ...doc.data() };
    } else {
      user = await mockDb.getUser(userId);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve user profile',
      error: error.message,
    });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const updates = sanitizeObject(req.body);

    updates.updatedAt = new Date().toISOString();

    let user;
    if (isFirebaseInitialized) {
      await db.collection('users').doc(userId).update(updates);
      const doc = await db.collection('users').doc(userId).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
      user = { id: doc.id, ...doc.data() };
    } else {
      user = await mockDb.updateUser(userId, updates);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User profile updated successfully',
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let users = [];
    let total = 0;

    if (isFirebaseInitialized) {
      const snapshot = await db.collection('users').get();
      const allUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      total = allUsers.length;
      users = allUsers.slice(offset, offset + parseInt(limit));
    } else {
      const result = await mockDb.getAllUsers(parseInt(limit), offset);
      users = result.data;
      total = result.total;
    }

    const formattedUsers = users.map(formatUserResponse);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users: formattedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid user role',
      });
    }

    const updates = {
      role,
      updatedAt: new Date().toISOString(),
    };

    let user;
    if (isFirebaseInitialized) {
      await db.collection('users').doc(id).update(updates);

      if (role === USER_ROLES.ADMIN) {
        await auth.setCustomUserClaims(id, { role: 'admin' });
      } else {
        await auth.setCustomUserClaims(id, {});
      }

      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
      user = { id: doc.id, ...doc.data() };
    } else {
      user = await mockDb.updateUser(id, updates);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'User role updated successfully',
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
};
