import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../../Context/AdminContext';
import { ProductContext } from '../../Context/ProductContext';
import { Gem, ShoppingBag, BarChart } from 'lucide-react';

const Dashboard = () => {
  const { products } = useContext(ProductContext);
  const { orders, loading } = useContext(AdminContext);
  
  // Calculate key metrics
  const pendingOrders = orders.filter(order => order.order_status === 'Pending').length;
  const deliveredOrders = orders.filter(order => order.order_status === 'Delivered').length;
  const processingOrders = orders.filter(order => order.order_status === 'Processing').length;
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.order_date) - new Date(a.order_date)
  ).slice(0, 5);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total products */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg transition-all hover:shadow-indigo-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-transparent p-1 rounded-lg">
                <Gem className="text-indigo-500 h-6 w-6" />
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full">Products</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{products.length}</h3>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Products</span>
              <NavLink to="/admin/manage-products" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center no-underline">
                View all
              </NavLink>
            </div>
          </div>

          {/* Total orders */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg transition-all hover:shadow-green-500/20 hover:translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-transparent p-1 rounded-lg">
                <ShoppingBag className="text-green-500 h-6 w-6" />
              </div>
              <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full">Orders</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{orders.length}</h3>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-400 text-sm">Total Orders</span>
              <NavLink to="/admin/manage-orders" className="text-green-400 text-sm hover:text-green-300 flex items-center no-underline">
                View all
              </NavLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Box */}
          <div className="bg-gray-800 rounded-xl shadow-lg lg:col-span-1">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Order Status</h2>
                <div className="bg-transparent p-2 rounded-lg">
                  <BarChart className="text-indigo-500 h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Processing</span>
                  <span className="text-blue-400 font-medium">{processingOrders} orders</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${(processingOrders / orders.length) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Delivered</span>
                  <span className="text-green-400 font-medium">{deliveredOrders} orders</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${deliveredOrders / orders.length * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Delivered</span>
                  <span className="text-green-400 font-medium">{deliveredOrders} orders</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${deliveredOrders / orders.length * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Pending</span>
                  <span className=" text-yellow-300 font-medium">{pendingOrders} orders</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-300 h-2 rounded-full" style={{ width: `${deliveredOrders / orders.length * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Cancelled</span>
                  <span className="text-red-400 font-medium">{orders.filter(o => o.order_status === 'Cancelled').length} orders</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(orders.filter(o => o.order_status === 'Cancelled').length / orders.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-800 rounded-xl shadow-lg lg:col-span-2">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <NavLink to="/admin/manage-orders" className="text-indigo-400 no-underline hover:text-indigo-300 text-sm">
                  View All
                </NavLink>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentOrders.map(order => (
                    <tr key={order.order_id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">#{order.order_id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">{order.user.full_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">
                          {new Date(order.order_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-300">₹{Number(order.order_amt).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                          ${order.order_status === 'Delivered' ? 'bg-green-900/50 text-green-300' : ''}
                          ${order.order_status === 'Processing' ? 'bg-blue-900/50 text-blue-300' : ''}
                          ${order.order_status === 'Pending' ? 'bg-yellow-900/50 text-yellow-300' : ''}
                          ${order.order_status === 'Cancelled' ? 'bg-red-900/50 text-red-300' : ''}
                        `}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;