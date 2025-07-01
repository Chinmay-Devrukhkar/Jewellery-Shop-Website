import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../Context/AdminContext';

const ProductForm = ({ existingProduct, onClose }) => {
  const { addProduct, updateProduct } = useContext(AdminContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imageLinks, setImageLinks] = useState([]);
  const [currentImageLink, setCurrentImageLink] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    descrp: '',
    metal: '',
    krt_purt: '',
    category: '',
    gender: '',
    weight: '',
    discount: '0',
    images: []
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        ...existingProduct,
        price: existingProduct.price.toString(),
        krt_purt: existingProduct.krt_purt ? existingProduct.krt_purt.toString() : '',
        weight: existingProduct.weight ? existingProduct.weight.toString() : '',
        discount: existingProduct.discount ? existingProduct.discount.toString() : '0'
      });
      
      if (existingProduct.images && existingProduct.images.length > 0) {
        setImageLinks(existingProduct.images);
      }
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageLinkChange = (e) => {
    setCurrentImageLink(e.target.value);
  };

  const addImageLink = () => {
    if (currentImageLink.trim() !== '') {
      setImageLinks([...imageLinks, currentImageLink.trim()]);
      setCurrentImageLink('');
    }
  };

  const removeImageLink = (index) => {
    const newImageLinks = [...imageLinks];
    newImageLinks.splice(index, 1);
    setImageLinks(newImageLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert form values to appropriate types
      const productData = {
        ...formData,
        price: parseInt(formData.price, 10),
        krt_purt: formData.krt_purt ? parseInt(formData.krt_purt, 10) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        discount: formData.discount ? parseInt(formData.discount, 10) : 0,
        images: imageLinks // Use the array of image links
      };
      
      if (existingProduct) {
        await updateProduct(existingProduct.prod_id, productData);
      } else {
        await addProduct(productData);
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          {existingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 bg-transparent border-none hover:text-white"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-900 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Metal</label>
          <select
            name="metal"
            value={formData.metal}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value='Gold'>Gold</option>
            <option value='Silver'>Silver</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Karat/Purity</label>
          <input
            type="number"
            name="krt_purt"
            value={formData.krt_purt}
            onChange={handleChange}
            min='18'
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Earring">Earring</option>
            <option value="Pendant">Pendant</option>
            <option value="Watch">Watch</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Weight (grams)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Description</label>
        <textarea
          name="descrp"
          value={formData.descrp}
          onChange={handleChange}
          rows="4"
          className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Product Image Links</label>
        <div className="flex space-x-2">
          <input
            type="url"
            value={currentImageLink}
            onChange={handleImageLinkChange}
            placeholder="Enter image URL"
            className="flex-grow p-2 bg-gray-800 border border-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addImageLink}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-2">
          {imageLinks.map((link, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
              <div className="flex items-center space-x-2 overflow-hidden">
                <img 
                  src={link} 
                  alt={`Product preview ${index + 1}`} 
                  className="h-12 w-12 object-cover rounded"
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/100?text=Invalid+URL'}}
                />
                <div className="truncate">
                  <span className="text-gray-300 text-sm">{link}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeImageLink(index)}
                className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="btn px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : existingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;