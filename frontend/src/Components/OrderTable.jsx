import React from 'react';

const OrderTable = ({ orders, onViewDetails, onUpdateStatus }) => {
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-900">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Method</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-6 px-4 text-center text-white">No orders found</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-700 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap text-white">#{order.order_id}</td>
                <td className="py-3 px-4 whitespace-nowrap text-white">{formatDate(order.order_date)}</td>
                <td className="py-3 px-4 whitespace-nowrap text-white">{order.user?.full_name || 'Unknown'}</td>
                <td className="py-3 px-4 whitespace-nowrap text-white">₹{parseFloat(order.order_amt).toFixed(2)}</td>
                <td className="py-3 px-4 whitespace-nowrap text-white capitalize">{order.payment_method || 'N/A'}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status)} text-white`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="btn px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Details
                    </button>
                    <select
                      value={order.order_status}
                      onChange={(e) => onUpdateStatus(order.order_id, e.target.value)}
                      className="px-3 py-1 bg-gray-700 text-white text-xs rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;