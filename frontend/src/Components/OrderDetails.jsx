import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../Context/AdminContext';

const OrderDetails = ({ order, onClose }) => {
  const { products } = useContext(AdminContext);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prepareOrderItems = () => {
      setLoading(true);
      
      if (!order || !order.product_ids || !Array.isArray(order.product_ids) || order.product_ids.length === 0) {
        setOrderItems([]);
        setLoading(false);
        return;
      }

      try {
        // Map product_ids to actual product objects from the AdminContext
        const items = order.product_ids.map(productId => {
          const product = products.find(p => p.prod_id === productId);
          
          return {
            product_id: productId,
            product: product || null,
            name: product ? product.name : "Product Information Unavailable",
            price: product ? product.price : 0,
            quantity: 1 // Assuming quantity is 1 if not specified
          };
        });
        
        setOrderItems(items);
      } catch (error) {
        console.error('Error preparing order items:', error);
      } finally {
        setLoading(false);
      }
    };

    prepareOrderItems();
  }, [order, products]);

  if (!order) return null;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  // Status badge component with appropriate styling
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase() || 'pending') {
        case 'pending':
          return 'bg-yellow-500';
        case 'processing':
          return 'bg-orange-500';
        case 'shipped':
          return 'bg-blue-500';
        case 'delivered':
          return 'bg-green-500';
        case 'cancelled':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <span className={`px-2 py-1 rounded text-white text-xs font-medium ${getStatusColor()}`}>
        {status || 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white">
            Order #{order.order_id}
          </h2>
          <StatusBadge status={order.order_status} />
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-medium text-white mb-2">Order Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Order ID:</span>
              <span className="text-white font-medium">#{order.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">{formatDate(order.order_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-white">{order.order_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white font-medium">{formatPrice(order.order_amt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-medium text-white mb-2">Payment Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Method:</span>
              <span className="text-white capitalize">{order.payment_method || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment ID:</span>
              <span className="text-white">{order.payment_id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">Name:</span>
            <span className="text-white ml-2">{order.user?.full_name || 'Not available'}</span>
          </div>
          <div>
            <span className="text-gray-400">Email:</span>
            <span className="text-white ml-2">{order.user?.email || 'Not available'}</span>
          </div>
          <div>
            <span className="text-gray-400">Phone:</span>
            <span className="text-white ml-2">{order.user?.contact_no || 'Not available'}</span>
          </div>
          <div>
            <span className="text-gray-400">Address:</span>
            <span className="text-white ml-2">{order.user?.address || 'Not available'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-300">Product</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-300">Details</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-300">Price</th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.product?.images && item.product.images.length > 0 
                            ? item.product.images[0] 
                            : "/api/placeholder/120/120"}
                          alt={item.name}
                          className="h-10 w-10 object-cover rounded mr-2"
                        />
                        <span className="text-white">{item.name || 'Unknown Product'}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap text-gray-300 text-sm">
                      {item.product?.metal && <div>Metal: {item.product.metal}</div>}
                      {item.product?.krt_purt && <div>Karat: {item.product.krt_purt}</div>}
                      {item.product?.weight && <div>Weight: {item.product.weight}g</div>}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap text-white">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap text-white">
                      {formatPrice(parseFloat(item.price) * (item.quantity || 1))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-white">No items found</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-700">
                <td colSpan="3" className="py-2 px-4 text-right text-white font-medium">Total:</td>
                <td className="py-2 px-4 text-white font-medium">{formatPrice(order.order_amt)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;