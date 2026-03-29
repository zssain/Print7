'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useOMSStore } from '@/store/omsStore';
import { ChevronLeft, CheckCircle, Clock, AlertCircle, MessageCircle, Phone } from 'lucide-react';

const stageLabels: Record<string, string> = {
  'order-placed': 'Order Placed',
  'payment-verified': 'Payment Verified',
  'design-approved': 'Design Approved',
  'in-production': 'In Production',
  'quality-check': 'Quality Check',
  packaging: 'Packaging',
  shipped: 'Shipped',
  delivered: 'Delivered',
  'returns-refunds': 'Returns/Refunds',
};

const allStages = [
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

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { getOrderById } = useOMSStore();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link
            href="/dashboard/orders"
            className="text-blue-600 hover:underline flex items-center gap-2 justify-center"
          >
            <ChevronLeft size={20} />
            Back to Orders
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/orders"
            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-1">{order.id}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Order Date</p>
            <p className="text-xl font-bold text-gray-900 mt-2">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Order Total</p>
            <p className="text-xl font-bold text-gray-900 mt-2">${order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Current Status</p>
            <p className="text-xl font-bold text-blue-600 mt-2">
              {stageLabels[order.currentStage]}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Est. Delivery</p>
            <p className="text-xl font-bold text-gray-900 mt-2">
              {order.estimatedDelivery
                ? new Date(order.estimatedDelivery).toLocaleDateString()
                : 'Calculating...'}
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">Delivery Progress</h2>

          {/* Visual Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {allStages.map((stage, idx) => {
                const isCompleted = allStages.indexOf(order.currentStage) >= idx;
                const isCurrent = stage === order.currentStage;

                return (
                  <div key={stage} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-blue-600 text-white scale-125'
                            : 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {isCompleted && !isCurrent && <CheckCircle size={20} />}
                      {isCurrent && <Clock size={20} className="animate-spin" />}
                      {!isCompleted && idx + 1}
                    </div>

                    {idx < allStages.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 mt-2 ${
                          allStages.indexOf(order.currentStage) > idx ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    )}

                    <p className="text-xs font-medium text-gray-600 mt-3 text-center max-w-16 leading-tight">
                      {stageLabels[stage]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Timeline */}
          <div className="space-y-4 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-6">Timeline Details</h3>
            {order.timeline.map((timeline, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  {timeline.status === 'completed' && (
                    <CheckCircle className="text-green-500" size={28} />
                  )}
                  {timeline.status === 'current' && (
                    <Clock className="text-blue-600 animate-pulse" size={28} />
                  )}
                  {timeline.status === 'upcoming' && (
                    <div className="w-7 h-7 border-2 border-gray-300 rounded-full" />
                  )}
                  {idx < order.timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${
                        timeline.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      } my-2`}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-gray-900 text-base">
                    {stageLabels[timeline.stage]}
                  </p>
                  {timeline.timestamp && (
                    <p className="text-sm text-gray-600">
                      {new Date(timeline.timestamp).toLocaleString()}
                    </p>
                  )}
                  {timeline.note && (
                    <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded italic">
                      {timeline.note}
                    </p>
                  )}
                  {timeline.status === 'upcoming' && (
                    <p className="text-sm text-gray-500 mt-2">Coming soon</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Price: ${item.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <p className="font-semibold text-gray-900 text-lg">Total:</p>
                <p className="font-bold text-gray-900 text-lg">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Shipping & Support */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Delivery To</p>
                  <p className="font-medium text-gray-900">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                </div>
                {order.trackingNumber && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-mono font-semibold text-gray-900 text-sm break-all">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  Contact Support
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                  <AlertCircle size={18} />
                  Report an Issue
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                  <Phone size={18} />
                  Call Us
                </button>
              </div>
            </div>

            {/* Return/Refund */}
            {order.currentStage === 'delivered' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Request Return or Refund?</h3>
                <p className="text-sm text-blue-800 mb-4">
                  You can request a return or refund within 30 days of delivery.
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium text-sm">
                  Start Return Process
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
