import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../Context/AdminContext';
import OrderTable from '../../Components/OrderTable';
import OrderDetails from '../../Components/OrderDetails';
import { ShoppingBag, Search, Calendar, Filter, X } from 'lucide-react';

const ManageOrders = () => {
  const { orders, loading, error, updateOrderStatus } = useContext(AdminContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      let filtered = [...orders];
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(order => 
          order.order_id.toString().includes(search) ||
          order.user?.full_name?.toLowerCase().includes(search) ||
          order.user?.email?.toLowerCase().includes(search) ||
          order.payment_method?.toLowerCase().includes(search)
        );
      }
      
      // Apply status filter
      if (statusFilter) {
        filtered = filtered.filter(order => order.order_status === statusFilter);
      }
      
      // Apply date filter
      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.order_date);
          return (
            orderDate.getFullYear() === filterDate.getFullYear() &&
            orderDate.getMonth() === filterDate.getMonth() &&
            orderDate.getDate() === filterDate.getDate()
          );
        });
      }
      
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    // If the order being updated is the currently selected one, update its status
    if (selectedOrder && selectedOrder.order_id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus });
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
  };

  // Calculate key metrics
  const pendingOrders = orders.filter(order => order.order_status === 'Pending').length;
  const processingOrders = orders.filter(order => order.order_status === 'Processing').length;
  const shippedOrders = orders.filter(order => order.order_status === 'Shipped').length;
  const deliveredOrders = orders.filter(order => order.order_status === 'Delivered').length;
  const cancelledOrders = orders.filter(order => order.order_status === 'Cancelled').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transition-all hover:shadow-indigo-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-transparent rounded-lg">
                <ShoppingBag className="text-indigo-500 h-5 w-5" />
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{orders.length}</h3>
            <span className="text-gray-400 text-xs">All Orders</span>
          </div>

          {/* Pending Orders */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transition-all hover:shadow-yellow-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-transparent rounded-lg">
                <ShoppingBag className="text-yellow-500 h-5 w-5" />
              </div>
              <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded-full">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{pendingOrders}</h3>
            <span className="text-gray-400 text-xs">{((pendingOrders / orders.length) * 100).toFixed(1)}% of total</span>
          </div>

          {/* Processing Orders */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transition-all hover:shadow-blue-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-transparent rounded-lg">
                <ShoppingBag className="text-blue-500 h-5 w-5" />
              </div>
              <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full">Processing</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{processingOrders}</h3>
            <span className="text-gray-400 text-xs">{((processingOrders / orders.length) * 100).toFixed(1)}% of total</span>
          </div>

          {/* Delivered Orders */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transition-all hover:shadow-green-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-transparent rounded-lg">
                <ShoppingBag className="text-green-500 h-5 w-5" />
              </div>
              <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full">Delivered</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{deliveredOrders}</h3>
            <span className="text-gray-400 text-xs">{((deliveredOrders / orders.length) * 100).toFixed(1)}% of total</span>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transition-all hover:shadow-red-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-transparent rounded-lg">
                <ShoppingBag className="text-red-500 h-5 w-5" />
              </div>
              <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded-full">Cancelled</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{cancelledOrders}</h3>
            <span className="text-gray-400 text-xs">{((cancelledOrders / orders.length) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        {/* Filters and Order List */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ID, customer name, email..."
                    className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <select
                      className="appearance-none w-full pl-3 pr-10 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  
                  {(searchTerm || statusFilter || dateFilter) && (
                    <button 
                      onClick={clearFilters}
                      className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {error ? (
                <div className="bg-red-900/50 text-red-300 p-4 rounded-lg mb-6">
                  Error loading orders: {error}
                </div>
              ) : (
                <>
                  <div className="mb-4 text-gray-300 flex justify-between items-center">
                    <span>
                      {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                    </span>
                    {filteredOrders.length > 0 && (
                      <div className="text-sm text-gray-400">
                        Showing {Math.min(50, filteredOrders.length)} of {filteredOrders.length}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <OrderTable 
                      orders={filteredOrders} 
                      onViewDetails={handleViewDetails} 
                      onUpdateStatus={handleUpdateStatus} 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-transparent p-6 rounded-xl w-full max-w-4xl max-h-screen overflow-y-auto border border-gray-700 shadow-lg">
            <OrderDetails 
              order={selectedOrder}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;