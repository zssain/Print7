'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Download, Eye } from 'lucide-react';
import { usePaymentStore } from '@/store/paymentStore';
import toast from 'react-hot-toast';

type DateRange = 'all' | 'this-month' | 'last-month' | 'last-3-months';
type StatusFilter = 'all' | 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';
type MethodFilter = 'all' | 'card' | 'wallet' | 'cod' | 'net-banking';

export default function TransactionsPage() {
  const { profile } = usePaymentStore();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = profile.transactions.filter((txn) => {
    // Date range filter
    const txnDate = new Date(txn.createdAt);
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    if (dateRange === 'this-month' && txnDate < currentMonth) return false;
    if (dateRange === 'last-month' && (txnDate < lastMonth || txnDate >= currentMonth)) return false;
    if (dateRange === 'last-3-months' && txnDate < threeMonthsAgo) return false;

    // Status filter
    if (statusFilter !== 'all' && txn.status !== statusFilter) return false;

    // Method filter
    if (methodFilter !== 'all' && txn.method !== methodFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        txn.id.toLowerCase().includes(query) ||
        txn.orderId.toLowerCase().includes(query) ||
        txn.methodDetail.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary stats
  const totalSpent = profile.transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const successfulTransactions = profile.transactions.filter(
    (txn) => txn.status === 'completed'
  ).length;
  const failedTransactions = profile.transactions.filter(
    (txn) => txn.status === 'failed'
  ).length;
  const totalRefunded = profile.transactions
    .filter((txn) => txn.status === 'refunded')
    .reduce((sum, txn) => sum + (txn.refundAmount || 0), 0);

  const handleExport = () => {
    const csv = [
      ['Date', 'Transaction ID', 'Order ID', 'Method', 'Amount', 'Status', 'Completed At'],
      ...filteredTransactions.map((txn) => [
        new Date(txn.createdAt).toLocaleDateString(),
        txn.id,
        txn.orderId,
        txn.methodDetail,
        `$${txn.amount.toFixed(2)}`,
        txn.status,
        txn.completedAt ? new Date(txn.completedAt).toLocaleString() : '-',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Transactions exported');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1A1A2E] mb-2">Transaction History</h1>
        <p className="text-gray-600 mb-8">View and manage all your payment transactions</p>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-[#1A1A2E]">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Successful</p>
            <p className="text-3xl font-bold text-green-600">{successfulTransactions}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Failed</p>
            <p className="text-3xl font-bold text-red-600">{failedTransactions}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Refunded</p>
            <p className="text-3xl font-bold text-purple-600">${totalRefunded.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Transaction ID or Order ID"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value as DateRange);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value as MethodFilter);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Methods</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
                <option value="cod">Cash on Delivery</option>
                <option value="net-banking">Net Banking</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        {paginatedTransactions.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 w-12" />
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <div key={transaction.id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setExpandedRow(expandedRow === transaction.id ? null : transaction.id)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform ${
                              expandedRow === transaction.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {transaction.orderId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.methodDetail}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setExpandedRow(expandedRow === transaction.id ? null : transaction.id)
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row Details */}
                    {expandedRow === transaction.id && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan={8} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                Transaction ID
                              </p>
                              <p className="text-sm text-gray-900 font-mono">{transaction.id}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                Order ID
                              </p>
                              <p className="text-sm text-gray-900 font-mono">{transaction.orderId}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                Payment Method
                              </p>
                              <p className="text-sm text-gray-900">{transaction.methodDetail}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                Amount
                              </p>
                              <p className="text-sm text-gray-900 font-semibold">
                                ${transaction.amount.toFixed(2)} {transaction.currency}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                Status
                              </p>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </span>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                Initiated At
                              </p>
                              <p className="text-sm text-gray-900">
                                {new Date(transaction.createdAt).toLocaleString('en-US')}
                              </p>
                            </div>

                            {transaction.completedAt && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                  Completed At
                                </p>
                                <p className="text-sm text-gray-900">
                                  {new Date(transaction.completedAt).toLocaleString('en-US')}
                                </p>
                              </div>
                            )}

                            {transaction.refundedAt && (
                              <>
                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                    Refunded At
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    {new Date(transaction.refundedAt).toLocaleString('en-US')}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                    Refund Amount
                                  </p>
                                  <p className="text-sm text-green-600 font-semibold">
                                    ${transaction.refundAmount?.toFixed(2)} {transaction.currency}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </div>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                  {filteredTransactions.length} transactions
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-600 text-lg">No transactions found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
