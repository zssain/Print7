'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AdminLayout } from '@/components/AdminLayout';
import { useOMSStore } from '@/store/omsStore';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

const stages = [
  'order-placed',
  'payment-verified',
  'design-approved',
  'in-production',
  'quality-check',
  'packaging',
  'shipped',
  'delivered',
  'returns-refunds',
];

const stageLabels: Record<string, string> = {
  'order-placed': 'Order Placed',
  'payment-verified': 'Payment Verified',
  'design-approved': 'Design Approved',
  'in-production': 'In Production',
  'quality-check': 'Quality Check',
  'packaging': 'Packaging',
  shipped: 'Shipped',
  delivered: 'Delivered',
  'returns-refunds': 'Returns/Refunds',
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const { getOrderById, moveToNextStage, moveToPreviousStage, addNote, updatePriority } =
    useOMSStore();

  const order = getOrderById(orderId);
  const [newNote, setNewNote] = useState('');
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link
            href="/admin/oms"
            className="text-blue-600 hover:underline flex items-center gap-2 justify-center"
          >
            <ChevronLeft size={20} />
            Back to OMS
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const currentStageIndex = stages.indexOf(order.currentStage);
  const canMoveNext = currentStageIndex < stages.length - 1;
  const canMovePrevious = currentStageIndex > 0;

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(order.id, 'Admin', newNote);
      setNewNote('');
    }
  };

  const handleMoveNext = () => {
    moveToNextStage(order.id);
  };

  const handleMovePrevious = () => {
    moveToPreviousStage(order.id);
  };

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/oms"
            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">{order.id}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(order.priority)}`}>
              {order.priority}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="text-lg font-semibold text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Processing Timeline</h2>
              <div className="space-y-4">
                {order.timeline.map((timeline, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {timeline.status === 'completed' && (
                        <CheckCircle className="text-green-500" size={32} />
                      )}
                      {timeline.status === 'current' && (
                        <Clock className="text-blue-500 animate-pulse" size={32} />
                      )}
                      {timeline.status === 'upcoming' && (
                        <div className="w-8 h-8 border-2 border-gray-300 rounded-full" />
                      )}
                      {idx < order.timeline.length - 1 && (
                        <div
                          className={`w-1 h-12 ${
                            timeline.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          } my-2`}
                        />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className="font-semibold text-gray-900">
                        {stageLabels[timeline.stage]}
                      </p>
                      {timeline.timestamp && (
                        <p className="text-sm text-gray-600">
                          {new Date(timeline.timestamp).toLocaleString()}
                        </p>
                      )}
                      {timeline.note && (
                        <p className="text-sm text-gray-700 mt-1 italic">{timeline.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Unit Price: ${item.price}</p>
                      <p className="text-sm text-gray-600">
                        Subtotal: ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <p className="text-lg font-bold text-gray-900">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail size={18} />
                    Contact
                  </h3>
                  <p className="text-gray-600">{order.customerName}</p>
                  <p className="text-gray-600">{order.customerEmail}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} />
                    Shipping Address
                  </h3>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-semibold text-gray-900">{order.transactionId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Internal Notes
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send size={18} />
                    Add Note
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {order.notes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-gray-900 text-sm">{note.author}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(note.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-gray-700 text-sm">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Stage Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Stage Navigation</h2>
              <div className="space-y-2">
                {canMovePrevious && (
                  <button
                    onClick={handleMovePrevious}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Move Back
                  </button>
                )}
                {canMoveNext && (
                  <button
                    onClick={handleMoveNext}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    Move to Next
                    <ChevronRight size={18} />
                  </button>
                )}
                {!canMoveNext && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center">
                    This order is complete
                  </div>
                )}
              </div>
            </div>

            {/* Priority Manager */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Level</h2>
              <div className="relative">
                <button
                  onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-between ${getPriorityColor(order.priority)}`}
                >
                  {order.priority}
                  <ChevronRight size={18} />
                </button>
                {priorityDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {['normal', 'rush', 'express'].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => {
                          updatePriority(order.id, priority as any);
                          setPriorityDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  Send Status Email
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  Print Label
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  View Design
                </button>
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracking Information</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-mono font-semibold text-gray-900 break-all">
                    {order.trackingNumber}
                  </p>
                  {order.estimatedDelivery && (
                    <>
                      <p className="text-sm text-gray-600 mt-4">Estimated Delivery</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
