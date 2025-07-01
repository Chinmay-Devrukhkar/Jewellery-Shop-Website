import React from 'react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-900">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Metal</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-6 px-4 text-center text-white">No products found</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.prod_id} className="hover:bg-gray-700 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap text-white">{product.prod_id}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-600 rounded flex items-center justify-center text-gray-400">
                      No img
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-white">{product.name}</td>
                <td className="py-3 px-4 whitespace-nowrap text-white">
                ₹{product.price}
                  {product.discount > 0 && (
                    <span className="ml-2 text-green-400 text-xs">
                      {product.discount}% off
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-white">{product.category}</td>
                <td className="py-3 px-4 whitespace-nowrap text-white">
                  {product.metal} {product.metal === 'Gold' ? `${product.krt_purt}K` : `${product.krt_purt}`}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="btn px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.prod_id)}
                      className="btn px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
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

export default ProductTable;