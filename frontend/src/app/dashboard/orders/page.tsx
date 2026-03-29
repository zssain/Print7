'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function OrdersPage() {
  const user = useAuthStore(state => state.user);

  if (!user) {
    return (
      <div className="container-print7 py-16 text-center">
        <h1 className="text-3xl font-bold text-print7-dark mb-4">Access Denied</h1>
        <Link href="/auth/login">
          <Button variant="primary" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const orders = [
    {
      id: '#12345',
      date: 'December 15, 2024',
      status: 'Delivered',
      statusColor: 'green',
      total: '$49.99',
      items: 2,
      tracking: 'TRK-98765432',
    },
    {
      id: '#12344',
      date: 'December 8, 2024',
      status: 'Shipped',
      statusColor: 'blue',
      total: '$35.50',
      items: 1,
      tracking: 'TRK-98765431',
    },
    {
      id: '#12343',
      date: 'December 1, 2024',
      status: 'Delivered',
      statusColor: 'green',
      total: '$39.50',
      items: 3,
      tracking: 'TRK-98765430',
    },
    {
      id: '#12342',
      date: 'November 24, 2024',
      status: 'Delivered',
      statusColor: 'green',
      total: '$99.99',
      items: 5,
      tracking: 'TRK-98765429',
    },
  ];

  return (
    <div className="container-print7 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-print7-dark">Order History</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-print7-light border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-print7-dark">Order ID</th>
                <th className="px-6 py-4 text-left font-semibold text-print7-dark">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-print7-dark">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-print7-dark">Items</th>
                <th className="px-6 py-4 text-left font-semibold text-print7-dark">Total</th>
                <th className="px-6 py-4 text-left font-semibold text-print7-dark">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-print7-dark">{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.statusColor === 'green'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.items} items</td>
                  <td className="px-6 py-4 font-bold text-print7-primary">{order.total}</td>
                  <td className="px-6 py-4">
                    <button className="text-print7-primary hover:text-blue-700 flex items-center gap-1">
                      Details
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="font-bold text-print7-dark mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-print7-primary">4</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">🚚</div>
          <h3 className="font-bold text-print7-dark mb-2">In Transit</h3>
          <p className="text-3xl font-bold text-print7-primary">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-bold text-print7-dark mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-print7-primary">$224.98</p>
        </div>
      </div>
    </div>
  );
}
