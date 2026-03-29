'use client';

import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ChevronDown, Eye, MoreVertical } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  itemsCount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: string;
  }>;
  address: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Anderson',
    email: 'john@example.com',
    date: '2024-03-24',
    itemsCount: 2,
    status: 'delivered',
    total: '$125.50',
    items: [
      { productName: 'Premium Business Cards', quantity: 1, price: '$24.99' },
      { productName: 'Flyer Set', quantity: 1, price: '$100.51' },
    ],
    address: '123 Main St, New York, NY 10001',
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Mitchell',
    email: 'sarah@example.com',
    date: '2024-03-24',
    itemsCount: 1,
    status: 'shipped',
    total: '$89.99',
    items: [
      { productName: 'Custom Mug', quantity: 2, price: '$89.99' },
    ],
    address: '456 Oak Ave, Los Angeles, CA 90001',
  },
  {
    id: 'ORD-003',
    customerName: 'Michael Chen',
    email: 'michael@example.com',
    date: '2024-03-23',
    itemsCount: 3,
    status: 'processing',
    total: '$245.00',
    items: [
      { productName: 'T-Shirt', quantity: 5, price: '$125.00' },
      { productName: 'Poster', quantity: 2, price: '$120.00' },
    ],
    address: '789 Pine Rd, Chicago, IL 60601',
  },
  {
    id: 'ORD-004',
    customerName: 'Emma Thompson',
    email: 'emma@example.com',
    date: '2024-03-23',
    itemsCount: 1,
    status: 'pending',
    total: '$156.75',
    items: [
      { productName: 'Business Cards Set', quantity: 3, price: '$156.75' },
    ],
    address: '321 Elm St, Houston, TX 77001',
  },
  {
    id: 'ORD-005',
    customerName: 'David Martinez',
    email: 'david@example.com',
    date: '2024-03-22',
    itemsCount: 2,
    status: 'delivered',
    total: '$199.99',
    items: [
      { productName: 'Canvas Print', quantity: 1, price: '$99.99' },
      { productName: 'Photo Book', quantity: 1, price: '$100.00' },
    ],
    address: '654 Spruce Ln, Phoenix, AZ 85001',
  },
  {
    id: 'ORD-006',
    customerName: 'Jessica Brown',
    email: 'jessica@example.com',
    date: '2024-03-22',
    itemsCount: 1,
    status: 'shipped',
    total: '$78.50',
    items: [
      { productName: 'Sticker Pack', quantity: 1, price: '$78.50' },
    ],
    address: '987 Birch Dr, Philadelphia, PA 19101',
  },
  {
    id: 'ORD-007',
    customerName: 'Robert Wilson',
    email: 'robert@example.com',
    date: '2024-03-21',
    itemsCount: 4,
    status: 'delivered',
    total: '$312.45',
    items: [
      { productName: 'Hoodie', quantity: 2, price: '$180.00' },
      { productName: 'Hat', quantity: 2, price: '$132.45' },
    ],
    address: '147 Maple Ave, San Antonio, TX 78201',
  },
  {
    id: 'ORD-008',
    customerName: 'Lisa Garcia',
    email: 'lisa@example.com',
    date: '2024-03-21',
    itemsCount: 1,
    status: 'processing',
    total: '$45.99',
    items: [
      { productName: 'Keychain', quantity: 1, price: '$45.99' },
    ],
    address: '258 Willow St, San Diego, CA 92101',
  },
  {
    id: 'ORD-009',
    customerName: 'James Johnson',
    email: 'james@example.com',
    date: '2024-03-20',
    itemsCount: 2,
    status: 'pending',
    total: '$167.80',
    items: [
      { productName: 'Pen Set', quantity: 1, price: '$45.00' },
      { productName: 'Notebook', quantity: 3, price: '$122.80' },
    ],
    address: '369 Cedar Rd, Dallas, TX 75201',
  },
  {
    id: 'ORD-010',
    customerName: 'Michelle Davis',
    email: 'michelle@example.com',
    date: '2024-03-20',
    itemsCount: 1,
    status: 'shipped',
    total: '$234.50',
    items: [
      { productName: 'Custom Banner', quantity: 1, price: '$234.50' },
    ],
    address: '741 Ash St, San Jose, CA 95101',
  },
];

type StatusFilterType = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered';

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') {
      return mockOrders;
    }
    return mockOrders.filter((order) => order.status === statusFilter);
  }, [statusFilter]);

  const toggleExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const statusOptions: Array<{ label: string; value: StatusFilterType }> = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 mt-1">
            Manage and track customer orders
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                statusFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-8 px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Items
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
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <ChevronDown
                              size={18}
                              className={`transform transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{order.id}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{order.customerName}</td>
                        <td className="px-6 py-4 text-gray-700">{order.email}</td>
                        <td className="px-6 py-4 text-gray-700">{order.date}</td>
                        <td className="px-6 py-4 text-gray-700">{order.itemsCount} items</td>
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
                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                              <Eye
                                size={16}
                                className="text-blue-600 group-hover:text-blue-700"
                              />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="space-y-4">
                              {/* Shipping Address */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Shipping Address
                                </h4>
                                <p className="text-sm text-gray-700">{order.address}</p>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Order Items
                                </h4>
                                <div className="bg-white rounded border border-gray-200">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="bg-gray-100 border-b border-gray-200">
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                                            Product
                                          </th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                                            Quantity
                                          </th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">
                                            Price
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {order.items.map((item, idx) => (
                                          <tr
                                            key={idx}
                                            className="border-b border-gray-200"
                                          >
                                            <td className="px-4 py-2 text-gray-700">
                                              {item.productName}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                              {item.quantity}
                                            </td>
                                            <td className="px-4 py-2 text-gray-700">
                                              {item.price}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>

                              {/* Status Update */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Update Status
                                </h4>
                                <select
                                  defaultValue={order.status}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}{' '}
              {statusFilter !== 'all' && `with status: ${statusFilter}`}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
