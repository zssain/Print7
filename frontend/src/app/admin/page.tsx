'use client';

import { AdminLayout } from '@/components/AdminLayout';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Eye,
  Download,
  MoreVertical,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: string;
}

const statCards: StatCard[] = [
  {
    label: 'Total Orders',
    value: '156',
    icon: <ShoppingCart size={24} />,
    trend: '+12% from last month',
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Revenue',
    value: '$24,500',
    icon: <DollarSign size={24} />,
    trend: '+8% from last month',
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'Active Users',
    value: '1,230',
    icon: <Users size={24} />,
    trend: '+5% from last month',
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: 'Products',
    value: '48',
    icon: <Package size={24} />,
    trend: '+2 new this month',
    color: 'from-orange-500 to-orange-600',
  },
];

const recentOrders: RecentOrder[] = [
  {
    id: 'ORD-001',
    customer: 'John Anderson',
    date: '2024-03-24',
    status: 'delivered',
    total: '$125.50',
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Mitchell',
    date: '2024-03-24',
    status: 'shipped',
    total: '$89.99',
  },
  {
    id: 'ORD-003',
    customer: 'Michael Chen',
    date: '2024-03-23',
    status: 'processing',
    total: '$245.00',
  },
  {
    id: 'ORD-004',
    customer: 'Emma Thompson',
    date: '2024-03-23',
    status: 'pending',
    total: '$156.75',
  },
  {
    id: 'ORD-005',
    customer: 'David Martinez',
    date: '2024-03-22',
    status: 'delivered',
    total: '$199.99',
  },
  {
    id: 'ORD-006',
    customer: 'Jessica Brown',
    date: '2024-03-22',
    status: 'shipped',
    total: '$78.50',
  },
];

const getStatusBadgeStyle = (status: string) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
  };
  return styles[status as keyof typeof styles] || styles.pending;
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-2">Welcome back! Here's your business overview.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
                >
                  {stat.icon}
                </div>
                <TrendingUp size={18} className="text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.label}</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.trend && (
                <p className="text-xs text-green-600 mt-3">{stat.trend}</p>
              )}
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-700">{order.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.total}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                          <Eye size={16} className="text-gray-600" />
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
        </div>
      </div>
    </AdminLayout>
  );
}
