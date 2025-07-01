import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminContext = createContext();

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api/admin',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products: " + (err.response?.data?.message || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch orders: " + (err.response?.data?.message || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Add a new product
  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await api.post('/products', productData);
      setProducts([...products, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to add product: " + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a product
  const updateProduct = async (prodId, productData) => {
    setLoading(true);
    try {
      const response = await api.put(`/products/${prodId}`, productData);
      setProducts(products.map(product => 
        product.prod_id === prodId ? response.data : product
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to update product: " + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (prodId) => {
    setLoading(true);
    try {
      await api.delete(`/products/${prodId}`);
      setProducts(products.filter(product => product.prod_id !== prodId));
      setError(null);
      return true;
    } catch (err) {
      setError("Failed to delete product: " + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { 
        status: newStatus 
      });
      
      setOrders(orders.map(order => 
        order.order_id === orderId ? {...order, order_status: newStatus} : order
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to update order status: " + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get order details with items
  const getOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to get order details: " + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // logout function
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/logout');
      
      // Only clear admin-related data from localStorage, not user data
      if (localStorage.getItem('user')) {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.isAdmin) {
          localStorage.removeItem('user');
        }
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError("Failed to logout: " + (err.response?.data?.message || err.message));
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      getOrderDetails,
      logout
    }}>
      {children}
    </AdminContext.Provider>
  );
};