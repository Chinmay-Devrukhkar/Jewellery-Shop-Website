import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import axios from 'axios';

const OrdersPage = () => {
  // State for storing orders data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products first
        const productsResponse = await axios.get('http://localhost:3000/api/products/');
        const products = productsResponse.data;
        setAllProducts(products);
        
        // Then fetch user orders
        const ordersResponse = await axios.get('http://localhost:3000/api/orders/', {
          withCredentials: true // Important for sending cookies with request
        });
        
        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.orders);
          
          // Create order details map by filtering products for each order
          const detailsMap = {};
          ordersResponse.data.orders.forEach(order => {
            // Filter products that match the product_ids in the order
            const orderProducts = products.filter(product => 
              order.product_ids.includes(product.prod_id)
            );
            detailsMap[order.order_id] = orderProducts;
          });
          
          setOrderDetails(detailsMap);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle order expansion to show/hide details
  const toggleOrderExpansion = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return `₹${Number(price).toFixed(2)}`;
  };

  // Component for status badge with appropriate color
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'shipped':
          return 'bg-blue-100 text-blue-800';
        case 'delivered':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
        {status}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900">No orders found</h2>
              <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.order_id} className="bg-white shadow overflow-hidden rounded-lg">
                  {/* Order Header */}
                  <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Order #{order.order_id}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Placed on {formatDate(order.order_date)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <StatusBadge status={order.order_status} />
                      <button
                        onClick={() => toggleOrderExpansion(order.order_id)}
                        className="btn text-white hover:bg-[#bf8a28] border-none bg-[#C8A055] rounded-md px-2 py-1 font-medium text-sm transition duration-150 ease-in-out"
                      >
                        {expandedOrder === order.order_id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Order Details - shown when expanded */}
                  {expandedOrder === order.order_id && (
                    <div className="border-t border-gray-200">
                      {/* Product List */}
                      <ul className="divide-y divide-gray-200">
                        {orderDetails[order.order_id] && orderDetails[order.order_id].map((product) => (
                          <li 
                            key={product.prod_id} 
                            className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            <div className="flex items-center space-x-4">
                              {/* Product Image */}
                              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border border-gray-200">
                                <img
                                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                                  alt={product.name}
                                  className="h-full w-full object-cover object-center"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-image.jpg';
                                  }}
                                />
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.krt_purt}K, {product.metal}
                                </p>
                              </div>
                              {/* Price */}
                              <div className="text-sm font-medium text-gray-900">
                                {formatPrice(product.price)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Order Summary */}
                      <div className="bg-gray-50 px-4 py-5 sm:px-6">
                        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                          <span className="text-base font-semibold text-gray-900">Total</span>
                          <span className="text-base font-semibold text-gray-900">{formatPrice(order.order_amt)}</span>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <h4 className="text-sm font-medium text-gray-900">Shipping Information</h4>
                        <FetchUserAddress userId={order.user_id} />
                      </div>

                      {/* Order Actions */}
                      {order.order_status === 'Pending' && (
                        <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50">
                          <button 
                            onClick={() => cancelOrder(order.order_id)}
                            className="px-4 py-2 bg-red-600 border-none text-white rounded-md hover:bg-red-700 transition"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Component to fetch and display user address
const FetchUserAddress = ({ userId }) => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user`, {
          withCredentials: true
        });
        
        if (response.data && response.data.user) {
          setAddress({
            name: response.data.user.full_name,
            address: response.data.user.address,
            contact: response.data.user.contact_no
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user address:', error);
        setLoading(false);
      }
    };

    fetchUserAddress();
  }, [userId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading address...</p>;
  }

  if (!address) {
    return <p className="text-sm text-gray-500">Address information not available</p>;
  }

  return (
    <>
      <p className="mt-1 text-sm text-gray-500">{address.name}</p>
      <p className="text-sm text-gray-500">{address.address}</p>
      <p className="text-sm text-gray-500">Contact: {address.contact}</p>
    </>
  );
};

const cancelOrder = async (orderId) => {
  try {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    
    if (confirmed) {
      const response = await axios.put(`http://localhost:3000/api/orders/${orderId}/cancel`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        alert("Order cancelled successfully");
        window.location.reload(); // Refresh to show updated status
      } else {
        alert(response.data.message || "Failed to cancel order");
      }
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    alert("An error occurred while cancelling the order");
  }
};

export default OrdersPage;