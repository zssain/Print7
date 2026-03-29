'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminLayout } from '@/components/AdminLayout';
import { useOMSStore } from '@/store/omsStore';
import { ChevronRight, Search, Filter, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const stages = [
  { key: 'order-placed', label: 'Order Placed', color: 'bg-blue-100' },
  { key: 'payment-verified', label: 'Payment Verified', color: 'bg-blue-100' },
  { key: 'design-approved', label: 'Design Approved', color: 'bg-purple-100' },
  { key: 'in-production', label: 'In Production', color: 'bg-orange-100' },
  { key: 'quality-check', label: 'Quality Check', color: 'bg-yellow-100' },
  { key: 'packaging', label: 'Packaging', color: 'bg-green-100' },
  { key: 'shipped', label: 'Shipped', color: 'bg-cyan-100' },
  { key: 'delivered', label: 'Delivered', color: 'bg-teal-100' },
  { key: 'returns-refunds', label: 'Returns/Refunds', color: 'bg-red-100' },
];

export default function OMSDashboardPage() {
  const { orders, getOrdersByStage, getStats } = useOMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const stats = getStats();

  // Filter orders
  let filteredOrders = orders;

  if (searchTerm) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (priorityFilter !== 'all') {
    filteredOrders = filteredOrders.filter((order) => order.priority === priorityFilter);
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'rush':
        return 'bg-orange-100 text-orange-800';
      case 'express':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    const stageObj = stages.find((s) => s.key === stage);
    return stageObj?.color || 'bg-gray-100';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Processing Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage orders through all processing stages</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Orders Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedToday}</p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Revenue Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.revenueToday.toFixed(0)}
                </p>
              </div>
              <DollarSign className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Processing Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageProcessingTime}h</p>
              </div>
              <Clock className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Returns</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingReturns}</p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Processing Pipeline</h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {stages.map((stage, idx) => {
              const count = getOrdersByStage(stage.key as any).length;
              return (
                <div key={stage.key} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`${stage.color} rounded-lg p-4 min-w-max border border-gray-200`}>
                    <p className="text-sm font-semibold text-gray-900 text-center">{stage.label}</p>
                    <p className="text-2xl font-bold text-gray-900 text-center mt-2">{count}</p>
                  </div>
                  {idx < stages.length - 1 && <ChevronRight size={24} className="text-gray-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="normal">Normal</option>
              <option value="rush">Rush</option>
              <option value="express">Express</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              More Filters
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid gap-4 p-6" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(280px, 1fr))` }}>
              {stages.map((stage) => {
                const stageOrders = filteredOrders.filter((o) => o.currentStage === stage.key);
                return (
                  <div key={stage.key} className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-sm">{stage.label}</h3>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                        {stageOrders.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {stageOrders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/admin/oms/${order.id}`}
                          className="block bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-move"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{order.id}</p>
                              <p className="text-xs text-gray-600 truncate">{order.customerName}</p>
                              <p className="text-xs text-gray-500 mt-2">${order.totalAmount.toFixed(2)}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getPriorityColor(order.priority)}`}
                            >
                              {order.priority}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            {order.items.map((item) => (
                              <Image
                                key={item.product.id}
                                src={item.product.image}
                                alt={item.product.name}
                                width={24}
                                height={24}
                                className="w-6 h-6 rounded border border-gray-300 object-cover"
                                title={item.product.name}
                              />
                            ))}
                          </div>
                        </Link>
                      ))}
                      {stageOrders.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-4">No orders</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(order.currentStage)}`}>
                        {stages.find((s) => s.key === order.currentStage)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/oms/${order.id}`}
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">No orders match your filters.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
