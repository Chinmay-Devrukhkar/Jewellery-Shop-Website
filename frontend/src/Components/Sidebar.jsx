import React,{useContext} from 'react';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import { Gem, Home, ShoppingBag, LogOut, Store } from 'lucide-react'
import { AdminContext } from '../Context/AdminContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, loading } = useContext(AdminContext);
  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return path !== '/admin' && location.pathname.includes(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to main homepage
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col  shadow-lg z-50 left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center">
          
          <h2 className="text-xl font-bold">Admin<span className="text-indigo-400">Panel</span></h2>
        </div>
      </div>
       {/* Navigation */}
       <nav className="flex-1 py-8 px-4 overflow-y-auto">
        <div className="mb-4 px-4">
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h5>
        </div>
        <ul className="space-y-2 list-none">
          <li>
            <Link 
              to="/admin" 
              className={`no-underline flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/admin') 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Home size={18} className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/manage-products" 
              className={`no-underline flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/manage-products') 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Gem size={18} className="mr-3" />
              <span>Manage Products</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/manage-orders" 
              className={`no-underline flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/manage-orders') 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <ShoppingBag size={18} className="mr-3" />
              <span>Manage Orders</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/" 
              className={`no-underline flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive('/main') 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Store size={18} className='mr-3'/>
              <span>Main Website</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* logout button  */}
      <div className="mt-auto p-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="no-underline w-full flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span>{loading ? 'Logging out...' : 'Log Out'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;