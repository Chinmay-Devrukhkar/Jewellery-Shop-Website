import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main website components
import Homepage from './Page/Homepage';
import Login from './Page/Login/Login';
import ProductPage from './Page/ProductPage';
import CartPage from './Page/CartPage';
import ProductDetail from './Page/ProductDetail';
import UserAccountPage from './Page/UserAccountPage';
import OrdersPage from './Page/OrderPage';
import EditProfile from './Page/EditProfile';
import InfoPage from './Page/InfoPage';
import ScrollToTop from './Components/ScrollToTop';
import WishlistPage from './Page/WishlistPage';
import { WishProvider } from './Context/WishContext'; 

// Admin components
import Sidebar from './Components/Sidebar';
import AdminHeader from './Components/AdminHeader';
import Dashboard from './Page/Admin/Dashboard';
import ManageOrders from './Page/Admin/ManageOrders';
import ManageProducts from './Page/Admin/ManageProducts';
import ProductEditor from './Components/ProductEditor';
import OrderDetails from './Components/OrderDetails';
// import { AdminRoute } from './Components/AdminRoute';

// Context providers
import ProductProvider from './Context/ProductContext';
import CartProvider from './Context/CartContext';
import { AdminProvider } from './Context/AdminContext';
import { UserProvider } from './Context/UserContext';

// Create AuthContext
const AuthContext = React.createContext({
  isAuthenticated: null,
  user: null,
  setIsAuthenticated: () => {},
  setUser: () => {}
});

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth-status", { 
          credentials: "include" 
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Layout for main website
function MainLayout({ children }) {
  return (
    <>
      {/* <Header />
      <Navbar /> */}
      <main>{children}</main>
    </>
  );
}

// Layout for admin dashboard
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Protected route for regular users
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth-status", { 
          credentials: "include" 
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Protected route for admin users
function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Call your backend endpoint to verify admin status
        const response = await fetch("http://localhost:3000/api/admin/check-auth", { 
          credentials: "include" 
        });
        
        if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function App() {
  return (
    <ProductProvider>
      <CartProvider>
      <WishProvider>
        <AuthProvider>
          <UserProvider>
            <AdminProvider>
              <Router>
              <ScrollToTop/>
                <Routes>
                  {/* Main website routes */}
                  <Route path="/" element={<MainLayout><Homepage /></MainLayout>} />
                  <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                  <Route path="/jewellery/:category" element={<MainLayout><ProductPage /></MainLayout>} />
                  <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
                  <Route path="/jewellery/product/:productId" element={<MainLayout><ProductDetail /></MainLayout>} />
                  <Route path="/user" element={<MainLayout><ProtectedRoute><UserAccountPage /></ProtectedRoute></MainLayout>} />
                  <Route path="/user/orders" element={<MainLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></MainLayout>} />
                  <Route path="/user/edit" element={<MainLayout><ProtectedRoute><EditProfile /></ProtectedRoute></MainLayout>} />
                  <Route path="/user/wishlist" element={<MainLayout><ProtectedRoute><WishlistPage /></ProtectedRoute></MainLayout>} />
                  <Route path="/infopage" element={<MainLayout><InfoPage /></MainLayout>} />
                  {/* <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} /> */}
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/manage-orders" element={<AdminRoute><AdminLayout><ManageOrders /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/order/:orderId" element={<AdminRoute><AdminLayout><OrderDetails /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/manage-products" element={<AdminRoute><AdminLayout><ManageProducts /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/product/:productId" element={<AdminRoute><AdminLayout><ProductEditor /></AdminLayout></AdminRoute>} />
                </Routes>
              </Router>
            </AdminProvider>
          </UserProvider>
        </AuthProvider>
        </WishProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
export { AuthContext };