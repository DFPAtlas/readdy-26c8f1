
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    maintenance: true,
    emergency: true,
    reports: false
  });
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  const tabs = [
    { id: 'general', name: 'General Settings', icon: 'ri-settings-3-line' },
    { id: 'notifications', name: 'Notifications', icon: 'ri-notification-3-line' },
    { id: 'security', name: 'Security', icon: 'ri-shield-check-line' },
    { id: 'integrations', name: 'Integrations', icon: 'ri-plug-line' },
    { id: 'backup', name: 'Backup & Data', icon: 'ri-database-line' },
    { id: 'users', name: 'User Management', icon: 'ri-team-line' }
  ];

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch to dark theme for better visibility</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Language</h4>
              <p className="text-sm text-gray-600">Choose your preferred language</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Time Zone</h4>
              <p className="text-sm text-gray-600">Set your local time zone</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-8">Pacific Time (UTC-8)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Default Dashboard View</h4>
              <p className="text-sm text-gray-600">Choose your preferred dashboard layout</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="overview">Overview</option>
              <option value="maintenance">Maintenance</option>
              <option value="analytics">Analytics</option>
              <option value="work-orders">Work Orders</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Building Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building Name</label>
            <input
              type="text"
              defaultValue="Corporate Tower A"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Manager</label>
            <input
              type="text"
              defaultValue="Sarah Johnson"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              defaultValue="123 Business District, City, State 12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          {[ 
            { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Receive urgent alerts via SMS' },
            { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(item.key)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Types</h3>
        <div className="space-y-4">
          {[ 
            { key: 'maintenance', label: 'Maintenance Alerts', desc: 'Work orders, schedules, and updates' },
            { key: 'emergency', label: 'Emergency Alerts', desc: 'Critical system failures and emergencies' },
            { key: 'reports', label: 'Report Notifications', desc: 'Weekly and monthly report summaries' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(item.key)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                  } mt-0.5`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            {twoFactorEnabled ? (
              <div className="flex items-center space-x-2">
                <span className="text-green-600 text-sm font-medium">Enabled</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer">
                  Disable
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleEnable2FA()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Enable
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-gray-900">Enable 2FA</h4>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
            Enable
          </button>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <i className="ri-information-line text-white"></i>
            </div>
            <p className="text-sm text-blue-800">Two-factor authentication helps protect your account from unauthorized access.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Session Timeout</h4>
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Login Attempts</h4>
              <p className="text-sm text-gray-600">Maximum failed login attempts before lockout</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="3">3 attempts</option>
              <option value="5">5 attempts</option>
              <option value="10">10 attempts</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h3>
        <div className="space-y-4">
          {[ 
            { name: 'Microsoft Azure IoT', status: 'Connected', icon: 'ri-cloud-line', color: 'bg-blue-500' },
            { name: 'Slack Notifications', status: 'Connected', icon: 'ri-slack-line', color: 'bg-purple-500' },
            { name: 'Google Calendar', status: 'Disconnected', icon: 'ri-calendar-line', color: 'bg-red-500' },
            { name: 'Zapier Automation', status: 'Connected', icon: 'ri-flashlight-line', color: 'bg-orange-500' }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`${service.color} w-10 h-10 rounded-lg flex items-center justify-center mr-4`}>
                  <i className={`${service.icon} text-white`}></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">Status: {service.status}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  service.status === 'Connected'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {service.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
            <input
              type="text"
              defaultValue="https://api.buildingmanager.com/v1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex space-x-2">
              <input
                type="password"
                defaultValue="bm_1234567890abcdef"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer">
                Regenerate
              </button>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-alert-line text-white"></i>
              </div>
              <p className="text-sm text-yellow-800">Keep your API key secure and never share it publicly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Automatic Backup</h4>
              <p className="text-sm text-gray-600">Automatically backup data daily</p>
            </div>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                autoBackup ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  autoBackup ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Backup Frequency</h4>
              <p className="text-sm text-gray-600">How often to create backups</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Retention Period</h4>
              <p className="text-sm text-gray-600">How long to keep backups</p>
            </div>
            <select className="pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer mr-3">
              <i className="ri-download-cloud-line mr-2"></i>
              Create Backup Now
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer">
              <i className="ri-upload-cloud-line mr-2"></i>
              Restore Backup
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Backups</h3>
        <div className="space-y-3">
          {[ 
            { date: '2024-01-15 02:00 AM', size: '2.4 GB', status: 'Complete', type: 'Automatic' },
            { date: '2024-01-14 02:00 AM', size: '2.3 GB', status: 'Complete', type: 'Automatic' },
            { date: '2024-01-13 02:00 AM', size: '2.2 GB', status: 'Complete', type: 'Automatic' },
            { date: '2024-01-12 10:30 AM', size: '2.1 GB', status: 'Complete', type: 'Manual' }
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{backup.date}</p>
                <p className="text-sm text-gray-600">{backup.size} • {backup.type}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    backup.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {backup.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  <i className="ri-download-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Roles & Permissions</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
            <i className="ri-add-line mr-2"></i>
            Add User
          </button>
        </div>

        <div className="space-y-3">
          {[ 
            { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Administrator', status: 'Active', lastLogin: '2 hours ago' },
            { name: 'Mike Chen', email: 'mike@company.com', role: 'Maintenance Manager', status: 'Active', lastLogin: '1 day ago' },
            { name: 'Emma Davis', email: 'emma@company.com', role: 'Facilities Coordinator', status: 'Active', lastLogin: '3 hours ago' },
            { name: 'John Smith', email: 'john@company.com', role: 'Technician', status: 'Inactive', lastLogin: '1 week ago' }
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">{user.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.role}</p>
                  <p className="text-xs text-gray-500">Last login: {user.lastLogin}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.status}
                </span>
                <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  <i className="ri-edit-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Permission</th>
                <th className="text-center py-2">Admin</th>
                <th className="text-center py-2">Manager</th>
                <th className="text-center py-2">Coordinator</th>
                <th className="text-center py-2">Technician</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[ 
                { permission: 'View Dashboard', admin: true, manager: true, coordinator: true, technician: true },
                { permission: 'Create Work Orders', admin: true, manager: true, coordinator: true, technician: false },
                { permission: 'Manage Users', admin: true, manager: false, coordinator: false, technician: false },
                { permission: 'View Analytics', admin: true, manager: true, coordinator: false, technician: false },
                { permission: 'System Settings', admin: true, manager: false, coordinator: false, technician: false }
              ].map((perm, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{perm.permission}</td>
                  <td className="text-center py-3">
                    {perm.admin ? <i className="ri-check-line text-green-600"></i> : <i className="ri-close-line text-red-600"></i>}
                  </td>
                  <td className="text-center py-3">
                    {perm.manager ? <i className="ri-check-line text-green-600"></i> : <i className="ri-close-line text-red-600"></i>}
                  </td>
                  <td className="text-center py-3">
                    {perm.coordinator ? <i className="ri-check-line text-green-600"></i> : <i className="ri-close-line text-red-600"></i>}
                  </td>
                  <td className="text-center py-3">
                    {perm.technician ? <i className="ri-check-line text-green-600"></i> : <i className="ri-close-line text-red-600"></i>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const handleEnable2FA = () => {
    setShowTwoFactorModal(true);
    setQrCodeGenerated(true);
  };

  const handleConfirm2FA = async () => {
    setIsEnabling2FA(true);

    // Simulate API call
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setShowTwoFactorModal(false);
      setIsEnabling2FA(false);
      setVerificationCode('');
    }, 2000);
  };

  return (
    <AuthGuard allowedRoles={['company_admin', 'super_admin', 'platform_owner']}>
    <div className="min-h-screen bg-[#030912]">
      {/* Header */}
      <header className="bg-[#060d1c] shadow-sm border-b border-white/5">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer">
                <i className="ri-arrow-left-line text-white"></i>
              </Link>
              <h1 className="text-2xl font-bold text-white">System Settings</h1>
            </div>
            <div className="flex space-x-3">
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-refresh-line mr-2"></i>
                Reset to Defaults
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-save-line mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#060d1c] border-r border-white/5 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                    selectedTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${tab.icon} mr-3`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {selectedTab === 'general' && renderGeneralSettings()}
          {selectedTab === 'notifications' && renderNotifications()}
          {selectedTab === 'security' && renderSecurity()}
          {selectedTab === 'integrations' && renderIntegrations()}
          {selectedTab === 'backup' && renderBackup()}
          {selectedTab === 'users' && renderUsers()}
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-shield-check-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Secure your account with 2FA</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTwoFactorModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center space-y-4">
                {/* Step 1: QR Code */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Step 1: Scan QR Code</h4>
                  <div className="w-40 h-40 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center">
                      <i className="ri-qr-code-line text-4xl text-gray-400"></i>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Manual entry key: ABCD-EFGH-IJKL-MNOP
                  </p>
                </div>

                {/* Step 2: Verification */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Step 2: Enter Verification Code</h4>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                {/* Backup Codes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Backup Recovery Codes</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    Save these codes in a safe place. You can use them to access your account if you lose your device.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono bg-white p-3 rounded border">
                    <div>1. 9abc-def2</div>
                    <div>2. 3ghi-jkl4</div>
                    <div>3. 5mno-pqr6</div>
                    <div>4. 7stu-vwx8</div>
                    <div>5. 9yza-bcd0</div>
                    <div>6. 1efg-hij2</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirm2FA}
                    disabled={verificationCode.length !== 6 || isEnabling2FA}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isEnabling2FA ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Enabling...
                      </>
                    ) : (
                      <>
                        <i className="ri-shield-check-line mr-2"></i>
                        Enable 2FA
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowTwoFactorModal(false)}
                    disabled={isEnabling2FA}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}
