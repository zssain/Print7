'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useInventoryStore } from '@/store/inventoryStore';
import { ChevronLeft, Trash2, Settings, ShoppingCart } from 'lucide-react';

export default function InventoryDetailPage() {
  const params = useParams();
  const itemId = params.id as string;

  const { removeItem, updateItem, setReorderThreshold, toggleAutoReorder } =
    useInventoryStore((state) => ({
      removeItem: state.removeItem,
      updateItem: state.updateItem,
      setReorderThreshold: state.setReorderThreshold,
      toggleAutoReorder: state.toggleAutoReorder,
    }));

  const { items } = useInventoryStore();
  const item = items.find((i) => i.id === itemId);

  const [newThreshold, setNewThreshold] = useState(item?.reorderThreshold.toString() || '0');
  const [newReorderQty, setNewReorderQty] = useState(item?.reorderQuantity.toString() || '0');
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!item) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <Link
            href="/dashboard/inventory"
            className="text-blue-600 hover:underline flex items-center gap-2 justify-center"
          >
            <ChevronLeft size={20} />
            Back to Inventory
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSaveSettings = () => {
    setReorderThreshold(item.id, parseInt(newThreshold));
    updateItem(item.id, {
      reorderQuantity: parseInt(newReorderQty),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this item from inventory?')) {
      removeItem(item.id);
      window.location.href = '/dashboard/inventory';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/inventory"
            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Item Details</h1>
            <p className="text-gray-600 mt-1">{item.product.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex gap-6 mb-6">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={160}
                  height={160}
                  className="w-40 h-40 rounded object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{item.product.name}</h2>
                  <p className="text-gray-600 mt-2">{item.product.description}</p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Category:</span>
                      <span className="text-gray-600 ml-2">
                        {item.product.category.replace('-', ' ')}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Price:</span>
                      <span className="text-gray-600 ml-2">${item.product.price}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-gray-700">Material:</span>
                      <span className="text-gray-600 ml-2">{item.product.material || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stock</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-600">{item.quantity}</p>
                  <p className="text-gray-600 text-sm mt-2">Units in Stock</p>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Stock Progress</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          item.quantity > item.reorderThreshold * 0.5
                            ? 'bg-green-500'
                            : item.quantity > item.reorderThreshold * 0.2
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min((item.quantity / (item.reorderThreshold * 2)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'in-stock'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'low-stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status === 'in-stock' && 'In Stock'}
                      {item.status === 'low-stock' && 'Low Stock'}
                      {item.status === 'out-of-stock' && 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock History Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock History (6 Months)</h3>
              <div className="flex items-end justify-between gap-2 h-40">
                {item.stockHistory.map((entry, idx) => {
                  const maxQuantity = Math.max(...item.stockHistory.map((e) => e.quantity));
                  const heightPercent = (entry.quantity / maxQuantity) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center h-32 relative">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${heightPercent}%` }}
                          title={`${entry.month}: ${entry.quantity} units`}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{entry.month}</span>
                      <span className="text-xs text-gray-500">{entry.quantity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">ORD-001</p>
                    <p className="text-sm text-gray-600">Placed on March 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">500 units</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">ORD-002</p>
                    <p className="text-sm text-gray-600">Placed on February 20, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">300 units</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">ORD-003</p>
                    <p className="text-sm text-gray-600">Placed on January 10, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">250 units</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reorder Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={20} />
                Reorder Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reorder Threshold
                  </label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when stock falls below this level
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reorder Quantity
                  </label>
                  <input
                    type="number"
                    value={newReorderQty}
                    onChange={(e) => setNewReorderQty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Quantity to reorder automatically
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Auto Reorder</p>
                    <p className="text-xs text-gray-500">Automatically reorder when low</p>
                  </div>
                  <button
                    onClick={() => toggleAutoReorder(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.autoReorder ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.autoReorder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {settingsSaved && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    Settings saved successfully!
                  </div>
                )}

                <button
                  onClick={handleSaveSettings}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
                >
                  Save Settings
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  Reorder Now
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors font-medium">
                  Adjust Stock
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Remove Item
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${item.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Ordered</p>
                  <p className="font-medium text-gray-900">
                    {new Date(item.lastOrdered).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
