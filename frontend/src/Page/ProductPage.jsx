import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../Context/ProductContext';
import { SlidersHorizontal, X, RefreshCw } from 'lucide-react'; // Removed Search import
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import PItem from '../Components/PItem';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const { products } = useContext(ProductContext);
  const [localProducts, setLocalProducts] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const navigate = useNavigate();
  
  // Get filter parameters from URL
  const gender = searchParams.get('gender');
  const metal = searchParams.get('metal');
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : 0;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : 100000;
  const sortBy = searchParams.get('sortBy') || 'default';
  const searchQuery = searchParams.get('search') || '';
  
  // State for filter checkboxes and search
  const [selectedGenders, setSelectedGenders] = useState(gender ? [gender] : []);
  const [selectedCategories, setSelectedCategories] = useState(category && category !== 'allproducts' ? [category] : []);
  const [selectedMetals, setSelectedMetals] = useState(metal ? [metal] : []);
  
  // Update priceRange whenever URL parameters change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Handle price range changes
  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
  };

  // Handle checkbox changes
  const handleGenderChange = (value) => {
    setSelectedGenders(prevSelected => 
      prevSelected.includes(value) 
        ? prevSelected.filter(item => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleCategoryChange = (value) => {
    setSelectedCategories(prevSelected => 
      prevSelected.includes(value) 
        ? prevSelected.filter(item => item !== value)
        : [...prevSelected, value]
    );
  };

  const handleMetalChange = (value) => {
    setSelectedMetals(prevSelected => 
      prevSelected.includes(value) 
        ? prevSelected.filter(item => item !== value)
        : [...prevSelected, value]
    );
  };

  // Handle sort change - Apply sort immediately when user changes dropdown
  const handleSortChange = (e) => {
    const newSortValue = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', newSortValue);
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedGenders([]);
    setSelectedCategories([]);
    setSelectedMetals([]);
    setPriceRange([0, 100000]);
    
    // Create new URL parameters preserving only the search query if it exists
    const newParams = new URLSearchParams();
    if (searchQuery) {
      newParams.set('search', searchQuery);
    }
    setSearchParams(newParams);
  };

  // Clear search query specifically
  const clearSearchQuery = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  // Apply filters
  const applyFilters = () => {
    // Create new URL parameters
    const newParams = new URLSearchParams();
    
    // Add selected filters to URL parameters
    if (selectedGenders.length === 1) {
      newParams.set('gender', selectedGenders[0]);
    }
    
    if (selectedMetals.length === 1) {
      newParams.set('metal', selectedMetals[0]);
    }
    
    // Add price range
    newParams.set('minPrice', priceRange[0].toString());
    newParams.set('maxPrice', priceRange[1].toString());
    
    // Preserve sorting
    if (sortBy !== 'default') {
      newParams.set('sortBy', sortBy);
    }
    
    // Preserve search term if present
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    }
    
    // If category is selected in filter but different from URL param, navigate to the new category
    if (selectedCategories.length === 1 && selectedCategories[0] !== category) {
      navigate(`/jewellery/${selectedCategories[0]}?${newParams.toString()}`);
    } else {
      setSearchParams(newParams);
    }
    
    setIsFilter(false);
  };

  // Cancel filters
  const cancelFilters = () => {
    // Reset filter selections based on URL parameters
    setSelectedGenders(gender ? [gender] : []);
    setSelectedCategories(category && category !== 'allproducts' ? [category] : []);
    setSelectedMetals(metal ? [metal] : []);
    setPriceRange([minPrice, maxPrice]);
    setIsFilter(false);
  };

  // Filter and sort products
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name?.toLowerCase().includes(query) || 
          p.desc?.toLowerCase().includes(query) || 
          p.category?.toLowerCase().includes(query) ||
          p.metal?.toLowerCase().includes(query)
        );
      }
      
      // Apply category filter from URL param
      if (category && category !== 'allproducts') {
        filtered = filtered.filter(p => p.category === category);
      }
      
      // Apply gender filter from URL param
      if (gender) {
        filtered = filtered.filter(p => p.gender === gender);
      }
      
      // Apply metal filter from URL param
      if (metal) {
        filtered = filtered.filter(p => p.metal === metal);
      }
      
      // Apply price range filter
      filtered = filtered.filter(p => 
        p.price >= minPrice && p.price <= maxPrice
      );
      
      // Apply sorting based on the dropdown selection
      switch (sortBy) {
        case 'price-low-high':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => {
            // Sort by created_at timestamp in descending order (newest first)
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateB - dateA;
          });
          break;
        case 'discount':
          filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        default:
          // Default sorting is random (as provided by the API)
          break;
      }
      
      setLocalProducts(filtered);
    } else {
      setLocalProducts([]);
    }
  }, [category, gender, metal, minPrice, maxPrice, sortBy, searchQuery, products]);

  const categories = [
    'Pendant',
    'Bracelet',
    'Necklace',
    'Mangalsutra',
    'Rings',
    'Bangle',
    'Chain',
    'Earrings',
    'Nosepin'
  ];

  const genders = ['Men', 'Women'];
  const metals = ['Gold', 'Silver'];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      
      <main className="flex-grow bg-white">
        {/* Search Results Banner (if search is active) */}
        {searchQuery && (
          <div className="bg-gray-100 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Search results for: <span className="font-medium text-gray-900">"{searchQuery}"</span>
                  <span className="ml-2 text-sm">({localProducts.length} products found)</span>
                </p>
                <button 
                  onClick={clearSearchQuery}
                  className="btn text-sm text-red-600 bg-white border-red-600 p-1 rounded-lg"
                >
                  Clear search
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter and Sort Section - Search box removed */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 lg:py-6">
          <div className="flex justify-between items-center">
            <button 
              className="inline-flex items-center border-none justify-center gap-2 px-4 py-2.5 bg-[#C8A055] text-white rounded-lg hover:bg-[#bf8a28] transition-colors"
              onClick={() => setIsFilter(!isFilter)}
            >
              <SlidersHorizontal size={18} className="shrink-0" />
              <span>Filter</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium text-[1rem]">Sort By</span>
              <select 
                className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#C8A055]"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {localProducts.length > 0
            ? localProducts.map((product) => (
                <div key={product.prod_id} className="w-full">
                    <PItem product={product} />
                </div>
            ))
            : products.map((product) => ( 
                <div key={product.prod_id} className="w-full">
                    <PItem product={product} />
                </div>
            ))}
          </div>
          {localProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Filter Panel Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${
            isFilter ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsFilter(false)}
        >
          {/* Filter Panel */}
          <div 
            className={`fixed inset-y-0 right-0 w-full sm:max-w-[380px] bg-white shadow-xl transform transition-transform duration-300 ease-out overflow-hidden ${
              isFilter ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Filter Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                    title="Clear all filters"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button 
                    onClick={() => setIsFilter(false)}
                    className="p-2 rounded-full border-none bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Content */}
            <div className="px-4 py-5 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
              {/* Search filter removed from here */}
              
              {/* Clear All Filters Button */}
              <div className="pb-2">
                <button 
                  onClick={clearAllFilters}
                  className="flex items-center justify-center w-full gap-2 py-2.5 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <RefreshCw size={16} className="shrink-0" />
                  <span>Clear All Filters</span>
                </button>
              </div>

              {/* Gender Filter */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Gender</h4>
                <div className="grid grid-cols-2 gap-3">
                  {genders.map((genderOption) => (
                    <label key={genderOption} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#C8A055] focus:ring-[#C8A055]" 
                        checked={selectedGenders.includes(genderOption)}
                        onChange={() => handleGenderChange(genderOption)}
                      />
                      <span className="text-gray-700">{genderOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Category</h4>
                <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
                  {categories.map((categoryOption) => (
                    <label key={categoryOption} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#C8A055] focus:ring-[#C8A055]" 
                        checked={selectedCategories.includes(categoryOption)}
                        onChange={() => handleCategoryChange(categoryOption)}
                      />
                      <span className="text-gray-700">{categoryOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal Filter */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Metal</h4>
                <div className="grid grid-cols-2 gap-3">
                  {metals.map((metalOption) => (
                    <label key={metalOption} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-[#C8A055] focus:ring-[#C8A055]" 
                        checked={selectedMetals.includes(metalOption)}
                        onChange={() => handleMetalChange(metalOption)}
                      />
                      <span className="text-gray-700">{metalOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Price Range</h4>
                <div className="space-y-3 px-2">
                  <input 
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-4 py-3 border-none bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={cancelFilters}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-4 py-3 border-none bg-[#C8A055] text-white rounded-lg hover:bg-[#bf8a28] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A055]"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;