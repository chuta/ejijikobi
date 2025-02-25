'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { Order, OrderStatus } from '@/app/types/order';
import { getAllOrders, updateOrder } from '@/app/lib/supabase';
import { sendOrderStatusUpdateEmail } from '@/app/lib/email';

const columnHelper = createColumnHelper<Order>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Order ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Date',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor('shipping_address.full_name', {
    header: 'Customer',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <select
        value={info.getValue()}
        onChange={e => handleStatusChange(info.row.original.id, e.target.value as OrderStatus)}
        className="p-2 border rounded-lg"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    ),
  }),
  columnHelper.accessor('payment_status', {
    header: 'Payment',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('total', {
    header: 'Total',
    cell: info => `₦${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor('tracking_number', {
    header: 'Tracking',
    cell: info => (
      <input
        type="text"
        value={info.getValue() || ''}
        onChange={e => handleTrackingUpdate(info.row.original.id, e.target.value)}
        placeholder="Enter tracking number"
        className="p-2 border rounded-lg w-full"
      />
    ),
  }),
];

async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
  try {
    const updatedOrder = await updateOrder(orderId, { status: newStatus });
    await sendOrderStatusUpdateEmail(updatedOrder);
  } catch (error) {
    console.error('Failed to update order status:', error);
  }
}

async function handleTrackingUpdate(orderId: string, trackingNumber: string) {
  try {
    const trackingUrl = `https://shipping-provider.com/track/${trackingNumber}`;
    const updatedOrder = await updateOrder(orderId, {
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
    });
    if (updatedOrder.status === 'shipped') {
      await sendOrderStatusUpdateEmail(updatedOrder);
    }
  } catch (error) {
    console.error('Failed to update tracking number:', error);
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, paymentFilter]);

  async function loadOrders() {
    try {
      const { data, count } = await getAllOrders(page, 10, {
        status: statusFilter || undefined,
        payment_status: paymentFilter || undefined,
      });
      setOrders(data || []);
      setTotalPages(Math.ceil((count || 0) / 10));
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(200,162,84)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold mb-8">Order Management</h1>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div>
            Page {page} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
} 