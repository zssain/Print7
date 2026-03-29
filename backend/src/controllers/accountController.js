const mockDb = require('../data/mockDb');
const { getPaginationParams } = require('../utils/helpers');

async function getProfile(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    let profile = await mockDb.getProfile(userId);

    if (!profile) {
      // Create default profile if doesn't exist
      profile = await mockDb.addProfile(userId, {
        firstName: 'User',
        lastName: 'Account',
        email: req.user.email || 'user@print7.com',
        phone: '',
        businessName: '',
        businessType: '',
        website: '',
        taxId: '',
        defaultAddressId: null,
        defaultPaymentMethodId: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { firstName, lastName, email, phone, businessName, businessType, website, taxId, preferences } = req.body;

    let profile = await mockDb.getProfile(userId);

    if (!profile) {
      profile = await mockDb.addProfile(userId, {});
    }

    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (businessName !== undefined) updates.businessName = businessName;
    if (businessType !== undefined) updates.businessType = businessType;
    if (website !== undefined) updates.website = website;
    if (taxId !== undefined) updates.taxId = taxId;
    if (preferences !== undefined) updates.preferences = preferences;

    const updatedProfile = await mockDb.updateProfile(userId, updates);

    // Log activity
    await mockDb.addActivityLog(userId, {
      action: 'profile_updated',
      description: 'User updated their profile information',
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
}

async function getAddresses(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    const addresses = await mockDb.getUserAddresses(userId);

    return res.status(200).json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: {
        addresses,
        count: addresses.length,
      },
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve addresses',
      error: error.message,
    });
  }
}

async function addAddress(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { label, street, city, state, zipCode, country, isDefault } = req.body;

    if (!street || !city || !zipCode) {
      return res.status(400).json({
        success: false,
        message: 'street, city, and zipCode are required',
      });
    }

    const addressData = {
      label: label || 'Home',
      street,
      city,
      state: state || '',
      zipCode,
      country: country || 'US',
      isDefault: isDefault === true,
    };

    // If this is the default, unset other defaults
    if (isDefault) {
      const userAddresses = await mockDb.getUserAddresses(userId);
      for (const addr of userAddresses) {
        await mockDb.updateAddress(addr.id, { isDefault: false });
      }
    }

    const address = await mockDb.addAddress(userId, addressData);

    await mockDb.addActivityLog(userId, {
      action: 'address_added',
      description: `New address added: ${label || 'Home'}`,
    });

    return res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address,
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message,
    });
  }
}

async function updateAddress(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;
    const updates = req.body;

    const address = await mockDb.getAddress(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    if (address.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this address',
      });
    }

    const updatedAddress = await mockDb.updateAddress(id, updates);

    await mockDb.addActivityLog(userId, {
      action: 'address_updated',
      description: 'Address updated',
    });

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message,
    });
  }
}

async function deleteAddress(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const address = await mockDb.getAddress(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    if (address.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this address',
      });
    }

    await mockDb.deleteAddress(id);

    await mockDb.addActivityLog(userId, {
      action: 'address_deleted',
      description: 'Address deleted',
    });

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message,
    });
  }
}

async function setDefaultAddress(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.uid || req.user.id;

    const address = await mockDb.getAddress(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    if (address.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to set this address as default',
      });
    }

    // Unset all other defaults
    const userAddresses = await mockDb.getUserAddresses(userId);
    for (const addr of userAddresses) {
      await mockDb.updateAddress(addr.id, { isDefault: false });
    }

    const updatedAddress = await mockDb.updateAddress(id, { isDefault: true });

    await mockDb.addActivityLog(userId, {
      action: 'default_address_changed',
      description: 'Default address changed',
    });

    return res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: updatedAddress,
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message,
    });
  }
}

async function getActivity(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { page, limit, offset } = getPaginationParams(req.query);

    const result = await mockDb.getUserActivityLogs(userId, limit, offset);

    return res.status(200).json({
      success: true,
      message: 'Activity logs retrieved successfully',
      data: {
        activities: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve activity logs',
      error: error.message,
    });
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'currentPassword and newPassword are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
    }

    // Mock password change - in real app would hash and validate
    await mockDb.addActivityLog(userId, {
      action: 'password_changed',
      description: 'User changed their password',
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
}

async function updatePreferences(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { emailNotifications, smsNotifications, pushNotifications, marketingEmails } = req.body;

    let profile = await mockDb.getProfile(userId);

    if (!profile) {
      profile = await mockDb.addProfile(userId, {});
    }

    const preferences = {
      emailNotifications: emailNotifications !== false,
      smsNotifications: smsNotifications === true,
      pushNotifications: pushNotifications !== false,
      marketingEmails: marketingEmails === true,
    };

    const updatedProfile = await mockDb.updateProfile(userId, { preferences });

    await mockDb.addActivityLog(userId, {
      action: 'preferences_updated',
      description: 'Notification preferences updated',
    });

    return res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: updatedProfile.preferences },
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message,
    });
  }
}

async function exportData(req, res) {
  try {
    const userId = req.user.uid || req.user.id;

    // Mock data export request
    const exportRequest = {
      id: require('uuid').v4(),
      userId,
      status: 'processing',
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    await mockDb.addActivityLog(userId, {
      action: 'data_export_requested',
      description: 'User requested data export',
    });

    return res.status(202).json({
      success: true,
      message: 'Data export request received. You will receive a download link via email shortly.',
      data: exportRequest,
    });
  } catch (error) {
    console.error('Error requesting data export:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process data export request',
      error: error.message,
    });
  }
}

async function deleteAccount(req, res) {
  try {
    const userId = req.user.uid || req.user.id;
    const { password, confirmDeletion } = req.body;

    if (!password || confirmDeletion !== true) {
      return res.status(400).json({
        success: false,
        message: 'Password and deletion confirmation are required',
      });
    }

    // Mock account deletion
    await mockDb.addActivityLog(userId, {
      action: 'account_deleted',
      description: 'Account permanently deleted',
    });

    return res.status(200).json({
      success: true,
      message: 'Account has been permanently deleted',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message,
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getActivity,
  changePassword,
  updatePreferences,
  exportData,
  deleteAccount,
};
