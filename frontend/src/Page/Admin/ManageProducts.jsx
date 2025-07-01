import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../Context/AdminContext';
import ProductTable from '../../Components/ProductTable';
import ProductForm from '../../Components/ProductForm';
import {ProductContext} from '../../Context/ProductContext';;
const ManageProducts = () => {
  const {products} = useContext(ProductContext)
  const {loading, error, fetchProducts, deleteProduct } = useContext(AdminContext);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.metal.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [products, searchTerm]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsAddingProduct(true);
  };

  const handleFormClose = () => {
    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  return (
    <div className="p-6 bg-gray-900 ">
      <div className="flex  justify-between items-center mb-6">
      <input
          type="text"
          placeholder="Search products..."
          className="w-1/2 p-2 bg-gray-800 border border-gray-700 text-white rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleAddNewClick}
          className="btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </button>
      </div>

      <div className="mb-6">
        
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900 text-white p-4 rounded mb-6">
          Error loading products: {error}
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts} 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteProduct} 
        />
      )}

      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <ProductForm 
              existingProduct={editingProduct} 
              onClose={handleFormClose} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;