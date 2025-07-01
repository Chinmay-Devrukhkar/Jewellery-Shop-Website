import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, MessageSquare, Search } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Dashboard';
      case '/admin/manage-products':
        return 'Manage Products';
      case '/admin/manage-orders':
        return 'Manage Orders';
      case '/products/add':
        return 'Add New Product';
      default:
        if (location.pathname.startsWith('/products/edit/')) {
          return 'Edit Product';
        }
        return 'Admin Panel';
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
      <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
      
      <div className="flex items-center space-x-6">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
            AU
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;