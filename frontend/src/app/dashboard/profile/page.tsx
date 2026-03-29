'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Edit2, Save, X, Download, AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  // Personal Info State
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: user?.email || 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
  });

  // Business Info State
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    companyName: 'Acme Corporation',
    role: 'Marketing Director',
    industry: 'Technology',
    companySize: '50-200 employees',
    taxId: 'XX-XXXXXXX',
  });

  // Communication Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsAlerts: false,
    marketingEmails: true,
    orderUpdates: true,
  });

  // Security State
  const [editingSecurity, setEditingSecurity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const memberSince = new Date(2024, 0, 15).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activityLog = [
    { action: 'Logged in', timestamp: 'Today at 9:30 AM' },
    { action: 'Updated profile', timestamp: 'Yesterday at 2:45 PM' },
    { action: 'Placed order #ORD-015', timestamp: '3 days ago' },
    { action: 'Saved design "Summer Campaign"', timestamp: '1 week ago' },
    { action: 'Downloaded invoice', timestamp: '2 weeks ago' },
    { action: 'Updated password', timestamp: '1 month ago' },
    { action: 'Added new address', timestamp: '2 months ago' },
    { action: 'Changed email notification settings', timestamp: '2 months ago' },
    { action: 'Placed order #ORD-010', timestamp: '3 months ago' },
    { action: 'Created account', timestamp: 'January 15, 2024' },
  ];

  const activeSessions = [
    {
      device: 'Chrome on Windows',
      location: 'New York, USA',
      lastActive: 'Now',
      current: true,
    },
    {
      device: 'Safari on iPhone',
      location: 'New York, USA',
      lastActive: '2 hours ago',
      current: false,
    },
    {
      device: 'Firefox on Linux',
      location: 'Los Angeles, USA',
      lastActive: '5 days ago',
      current: false,
    },
  ];

  const handleSavePersonal = () => {
    setEditingPersonal(false);
  };

  const handleSaveBusiness = () => {
    setEditingBusiness(false);
  };

  const handleSaveSecurity = () => {
    setEditingSecurity(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {(personalInfo.firstName[0] + personalInfo.lastName[0]).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{personalInfo.email}</p>
            <p className="text-sm text-gray-500 mt-1">Member since {memberSince}</p>
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            {!editingPersonal && (
              <button
                onClick={() => setEditingPersonal(true)}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {editingPersonal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSavePersonal}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingPersonal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-medium text-gray-900">{personalInfo.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Name</p>
                <p className="font-medium text-gray-900">{personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{personalInfo.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">
                  {new Date(personalInfo.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Business Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
            {!editingBusiness && (
              <button
                onClick={() => setEditingBusiness(true)}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {editingBusiness ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={businessInfo.companyName}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={businessInfo.role}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={businessInfo.industry}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, industry: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={businessInfo.companySize}
                    onChange={(e) =>
                      setBusinessInfo({ ...businessInfo, companySize: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>50-200 employees</option>
                    <option>200-500 employees</option>
                    <option>500+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={businessInfo.taxId}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveBusiness}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingBusiness(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="font-medium text-gray-900">{businessInfo.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Job Title</p>
                <p className="font-medium text-gray-900">{businessInfo.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Industry</p>
                <p className="font-medium text-gray-900">{businessInfo.industry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Company Size</p>
                <p className="font-medium text-gray-900">{businessInfo.companySize}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tax ID</p>
                <p className="font-medium text-gray-900">{businessInfo.taxId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Communication Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Communication Preferences</h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'smsAlerts', label: 'SMS Alerts' },
              { key: 'marketingEmails', label: 'Marketing Emails' },
              { key: 'orderUpdates', label: 'Order Updates' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{label}</p>
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      [key]: !preferences[key as keyof typeof preferences],
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences[key as keyof typeof preferences] ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences[key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
            {!editingSecurity && (
              <button
                onClick={() => setEditingSecurity(true)}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {editingSecurity ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveSecurity}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingSecurity(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-600">••••••••••••</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <span className="text-sm text-gray-600">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h2>
          <div className="space-y-3">
            {activeSessions.map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{session.device}</p>
                  <p className="text-sm text-gray-600">{session.location}</p>
                  <p className="text-xs text-gray-500 mt-1">Last active: {session.lastActive}</p>
                </div>
                {session.current && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Current
                  </span>
                )}
                {!session.current && (
                  <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition-colors text-sm">
                    Sign Out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Activity Log */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Activity</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {activityLog.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <p className="text-gray-900 font-medium">{log.action}</p>
                <p className="text-sm text-gray-500">{log.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Data & Account Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Account Management</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium">
              <Download size={18} />
              Download My Data
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
            >
              <AlertTriangle size={18} />
              Delete Account
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Deleting your account is permanent and cannot be undone. All your data will be
            deleted.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
