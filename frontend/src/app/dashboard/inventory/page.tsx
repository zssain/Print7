'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useInventoryStore } from '@/store/inventoryStore';
import {
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Eye,
} from 'lucide-react';

export default function InventoryPage() {
  const {
    items,
    getLowStockItems,
    getTotalValue,
    removeItem,
  } = useInventoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const lowStockItems = getLowStockItems();
  const totalValue = getTotalValue();

  // Get unique categories
  const categories = Array.from(new Set(items.map((item) => item.product.category)));

  // Filter items
  let filteredItems = items;

  if (searchTerm) {
    filteredItems = filteredItems.filter((item) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (categoryFilter !== 'all') {
    filteredItems = filteredItems.filter((item) => item.product.category === categoryFilter);
  }

  if (statusFilter !== 'all') {
    filteredItems = filteredItems.filter((item) => item.status === statusFilter);
  }

  // Sort items
  if (sortBy === 'name') {
    filteredItems.sort((a, b) => a.product.name.localeCompare(b.product.name));
  } else if (sortBy === 'quantity') {
    filteredItems.sort((a, b) => b.quantity - a.quantity);
  } else if (sortBy === 'lastOrdered') {
    filteredItems.sort(
      (a, b) => new Date(b.lastOrdered).getTime() - new Date(a.lastOrdered).getTime()
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (quantity: number, threshold: number) => {
    const percent = (quantity / threshold) * 100;
    if (percent > 50) return 'bg-green-500';
    if (percent > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressPercent = (quantity: number, threshold: number) => {
    return Math.min((quantity / threshold) * 100, 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Track and manage your product inventory</p>
          </div>
          <button className="bg-[#0066CC] hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            Add to Inventory
          </button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-900">Low Stock Alert</h3>
                <p className="text-yellow-800 text-sm">
                  You have {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} below the
                  reorder threshold.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{items.length}</p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Reorders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {items.filter((i) => i.autoReorder && i.status === 'low-stock').length}
                </p>
              </div>
              <TrendingUp className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="lastOrdered">Sort by Last Ordered</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Last Ordered
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.product.name}</p>
                          <p className="text-xs text-gray-500">${item.product.price}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.product.category.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{item.quantity}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.reorderThreshold}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(item.quantity, item.reorderThreshold)}`}
                            style={{
                              width: `${getProgressPercent(item.quantity, item.reorderThreshold)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(getProgressPercent(item.quantity, item.reorderThreshold))}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {item.status === 'in-stock' && 'In Stock'}
                        {item.status === 'low-stock' && 'Low Stock'}
                        {item.status === 'out-of-stock' && 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.lastOrdered).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/inventory/${item.id}`}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          className="text-orange-600 hover:bg-orange-50 p-2 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">No inventory items match your filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
