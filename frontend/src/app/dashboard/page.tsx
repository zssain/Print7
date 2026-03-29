'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ShoppingBag, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  if (!user) {
    return (
      <div className="container-print7 py-16 text-center">
        <h1 className="text-3xl font-bold text-print7-dark mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">Please log in to view your dashboard</p>
        <Link href="/auth/login">
          <Button variant="primary" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="container-print7 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-print7-dark">Dashboard</h1>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">👤</div>
          <h3 className="font-bold text-print7-dark mb-1">Welcome</h3>
          <p className="text-gray-600">{user.name}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="font-bold text-print7-dark mb-1">Recent Orders</h3>
          <p className="text-2xl font-bold text-print7-primary">3</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">💾</div>
          <h3 className="font-bold text-print7-dark mb-1">Saved Designs</h3>
          <p className="text-2xl font-bold text-print7-primary">5</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-bold text-print7-dark mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-print7-primary">$124.99</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-print7-dark mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/products">
              <Button variant="outline" className="w-full text-left justify-start">
                <ShoppingBag size={18} className="mr-3" />
                Start Shopping
              </Button>
            </Link>
            <Link href="/dashboard/designs">
              <Button variant="outline" className="w-full text-left justify-start">
                <Save size={18} className="mr-3" />
                View Saved Designs
              </Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full text-left justify-start">
                <ShoppingBag size={18} className="mr-3" />
                Order History
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-left justify-start">
                <Settings size={18} className="mr-3" />
                Account Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-print7-dark mb-6">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold text-print7-dark">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Member Since</p>
              <p className="font-semibold text-print7-dark">January 2024</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Account Status</p>
              <p className="font-semibold text-print7-success">Active</p>
            </div>
            <div className="pt-4">
              <Button variant="secondary" className="w-full">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-print7-light rounded-lg p-6">
        <h2 className="text-2xl font-bold text-print7-dark mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="text-left py-3 font-semibold text-print7-dark">Order ID</th>
                <th className="text-left py-3 font-semibold text-print7-dark">Date</th>
                <th className="text-left py-3 font-semibold text-print7-dark">Status</th>
                <th className="text-left py-3 font-semibold text-print7-dark">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-700">#12345</td>
                <td className="py-3 text-gray-700">Dec 15, 2024</td>
                <td className="py-3"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Delivered</span></td>
                <td className="py-3 font-semibold text-print7-primary">$49.99</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-700">#12344</td>
                <td className="py-3 text-gray-700">Dec 8, 2024</td>
                <td className="py-3"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">Shipped</span></td>
                <td className="py-3 font-semibold text-print7-primary">$35.50</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">#12343</td>
                <td className="py-3 text-gray-700">Dec 1, 2024</td>
                <td className="py-3"><span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">Delivered</span></td>
                <td className="py-3 font-semibold text-print7-primary">$39.50</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link href="/dashboard/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
