import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../Context/AdminContext';

const ProductEditor = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getProduct, addProduct, updateProduct } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLinks, setImageLinks] = useState([]);
  const [currentImageLink, setCurrentImageLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    const fetchProduct = async () => {
      if (productId && productId !== 'new') {
        try {
          setLoading(true);
          const product = await getProduct(parseInt(productId, 10));
          
          if (product) {
            setFormData({
              ...product,
              price: product.price.toString(),
              krt_purt: product.krt_purt ? product.krt_purt.toString() : '',
              weight: product.weight ? product.weight.toString() : '',
              discount: product.discount ? product.discount.toString() : '0'
            });
            
            if (product.images && product.images.length > 0) {
              setImageLinks(product.images);
            }
          } else {
            setError('Product not found');
          }
        } catch (err) {
          setError(err.message || 'Error loading product');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, getProduct]);

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
      
      if (productId && productId !== 'new') {
        await updateProduct(parseInt(productId, 10), productData);
      } else {
        await addProduct(productData);
      }
      
      navigate('/admin/manage-products');
    } catch (err) {
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-white">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {productId && productId !== 'new' ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          onClick={() => navigate('/admin/manage-products')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Back to Products
        </button>
      </div>

      {error && (
        <div className="bg-red-900 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Metal</label>
              <select
                name="metal"
                value={formData.metal}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                min="18"
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Weight (g)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Product Image Links</label>
            <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 mb-4">
              <input
                type="url"
                value={currentImageLink}
                onChange={handleImageLinkChange}
                placeholder="Enter image URL"
                className="flex-grow p-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addImageLink}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Add Image Link
              </button>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4">
              {imageLinks.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product preview ${index}`}
                    className="w-24 h-24 object-cover rounded border border-gray-600"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/100?text=Invalid+URL'}}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageLink(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                  <div className="absolute -bottom-2 left-0 right-0 bg-black bg-opacity-70 text-xs text-white p-1 truncate text-center">
                    {url.substring(url.lastIndexOf('/') + 1, url.length).substring(0, 15)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-1">Add 2-3 image links to your product.</p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/manage-products')}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                productId && productId !== 'new' ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditor;