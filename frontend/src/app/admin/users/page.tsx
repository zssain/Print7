'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Search, Shield, UserCheck, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinedDate: string;
  ordersCount: number;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'John Anderson',
    email: 'john@example.com',
    role: 'user',
    joinedDate: '2024-01-15',
    ordersCount: 5,
  },
  {
    id: 'USR-002',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    role: 'admin',
    joinedDate: '2024-01-20',
    ordersCount: 12,
  },
  {
    id: 'USR-003',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'user',
    joinedDate: '2024-02-01',
    ordersCount: 3,
  },
  {
    id: 'USR-004',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    role: 'user',
    joinedDate: '2024-02-05',
    ordersCount: 8,
  },
  {
    id: 'USR-005',
    name: 'David Martinez',
    email: 'david@example.com',
    role: 'user',
    joinedDate: '2024-02-10',
    ordersCount: 2,
  },
  {
    id: 'USR-006',
    name: 'Jessica Brown',
    email: 'jessica@example.com',
    role: 'admin',
    joinedDate: '2024-02-15',
    ordersCount: 15,
  },
  {
    id: 'USR-007',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    role: 'user',
    joinedDate: '2024-02-20',
    ordersCount: 6,
  },
  {
    id: 'USR-008',
    name: 'Lisa Garcia',
    email: 'lisa@example.com',
    role: 'user',
    joinedDate: '2024-03-01',
    ordersCount: 1,
  },
  {
    id: 'USR-009',
    name: 'James Johnson',
    email: 'james@example.com',
    role: 'user',
    joinedDate: '2024-03-05',
    ordersCount: 4,
  },
  {
    id: 'USR-010',
    name: 'Michelle Davis',
    email: 'michelle@example.com',
    role: 'user',
    joinedDate: '2024-03-10',
    ordersCount: 7,
  },
  {
    id: 'USR-011',
    name: 'Christopher Lee',
    email: 'christopher@example.com',
    role: 'user',
    joinedDate: '2024-03-15',
    ordersCount: 2,
  },
  {
    id: 'USR-012',
    name: 'Amanda White',
    email: 'amanda@example.com',
    role: 'user',
    joinedDate: '2024-03-20',
    ordersCount: 9,
  },
];

const ITEMS_PER_PAGE = 10;

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRoles, setUserRoles] = useState<Record<string, 'admin' | 'user'>>(
    mockUsers.reduce((acc, user) => {
      acc[user.id] = user.role;
      return acc;
    }, {} as Record<string, 'admin' | 'user'>)
  );

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const toggleRole = (userId: string) => {
    setUserRoles((prev) => ({
      ...prev,
      [userId]: prev[userId] === 'admin' ? 'user' : 'admin',
    }));
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600',
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-3 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {/* User Avatar & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(
                            user.name
                          )} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{user.name}</span>
                          <span className="text-xs text-gray-500">{user.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                          userRoles[user.id] === 'admin'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {userRoles[user.id] === 'admin' ? (
                          <Shield size={14} />
                        ) : (
                          <UserCheck size={14} />
                        )}
                        {userRoles[user.id].charAt(0).toUpperCase() +
                          userRoles[user.id].slice(1)}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-gray-700">{user.joinedDate}</td>

                    {/* Orders Count */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                        {user.ordersCount}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRole(user.id)}
                          className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Toggle Role
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}{' '}
              of {filteredUsers.length} users
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{mockUsers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Administrators</h3>
            <p className="text-3xl font-bold text-gray-900">
              {mockUsers.filter((u) => userRoles[u.id] === 'admin').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">
              {mockUsers.reduce((sum, user) => sum + user.ordersCount, 0)}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
