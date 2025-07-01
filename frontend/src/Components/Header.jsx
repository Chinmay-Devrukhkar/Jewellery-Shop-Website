import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';
import logo from '../assets/logoIcon.png';

// Header Component - Fixed at top
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Updated to match App.jsx route structure: /jewellery/:category instead of /products/
      navigate(`/jewellery/allproducts?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white border-b z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-800 border-none bg-transparent"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>    

          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img 
              src={logo}
              alt="Abhushan Jewellers" 
              className="h-14 w-auto"
            />
          </NavLink>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-stone-800 bg-white border-none hover:text-gold-600 transition"
            >
              <Search size={24} />
            </button>
            <NavLink to="/user" className="text-stone-800 hover:text-gold-600 transition">
              <User size={24} />
            </NavLink>
            <NavLink to="/cart" className="text-stone-800 hover:text-gold-600 transition">
              <ShoppingBag size={24} />
            </NavLink>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`py-4 ${isSearchOpen ? 'block' : 'hidden'}`}>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for jewelry..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A055]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-transparent border-none text-gray-500 hover:text-[#C8A055]"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/jewellery/Rings" className="block no-underline px-3 py-2 text-stone-800 hover:bg-gray-50 rounded-md">
              Rings
            </NavLink>
            <NavLink to="/jewellery/Earrings" className="block no-underline px-3 py-2 t text-stone-800 hover:bg-gray-50 rounded-md">
              Earrings
            </NavLink>
            <NavLink to="/jewellery/allproducts?metal=Gold" className="block no-underline px-3 py-2 text-stone-800 hover:bg-gray-50 rounded-md">
              Gold
            </NavLink>
            <NavLink to="/jewellery/allproducts?metal=Silver" className="block no-underline px-3 py-2 text-stone-800 hover:bg-gray-50 rounded-md">
              Silver
            </NavLink>
            <NavLink to="/jewellery/Bracelet" className="block px-3 py-2 no-underline text-stone-800 hover:bg-gray-50 rounded-md">
              Bracelets
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;