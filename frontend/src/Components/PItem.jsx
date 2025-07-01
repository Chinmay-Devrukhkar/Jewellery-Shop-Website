import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { CartContext } from '../Context/CartContext';
import { WishContext } from '../Context/WishContext'; // Import WishContext

function PItem({ product }) {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishContext); // Use WishContext
  const [hoveredImage, setHoveredImage] = useState(product.images && product.images.length > 0 ? product.images[0] : '');
  
  // Check if product is in wishlist using context
  const isProductInWishlist = isInWishlist(product.prod_id);

  function handleToggleWishlist(e) {
    e.stopPropagation(); // prevents trigger parent div event 
    toggleWishlist(product); // Use context function to toggle wishlist
  }

  function handleMouseOver() {
    if (product.images && product.images.length > 1) {
      setHoveredImage(product.images[1]);
    }
  }

  function handleMouseLeave() {
    if (product.images && product.images.length > 0) {
      setHoveredImage(product.images[0]);
    }
  }

  return (
    <div className="w-full h-full">
      <div key={product.prod_id} className="group flex flex-col h-full">
        {/* Image Container - Updated for better mobile display */}
        <div
          className="relative aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden"
          onMouseLeave={handleMouseLeave}
          onMouseOver={handleMouseOver}
        >
          <img
            src={hoveredImage || "/api/placeholder/300/300"}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />
          {/* Wishlist heart icon */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          <button
            onClick={handleToggleWishlist}
            className="btn absolute top-2 right-2 p-2 border-none bg-transparent z-10"
          >
            <Heart
              size={20}
              className={`transition-colors ${isProductInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Product Info - Adjusted spacing for mobile */}
        <div className="flex flex-col flex-grow">
          <div className="text-center mb-3">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">{product.category}</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900">₹{product.price}</p>
          </div>

          {/* Buttons Container - Improved mobile layout */}
          <div className="mt-auto">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => addToCart(product)}
                className="btn w-full px-3 py-2 bg-[#C8A055] text-white text-sm border-none rounded-lg hover:bg-[#bf8a28] transition-colors flex items-center justify-center gap-1">
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
              <NavLink
                className="w-full no-underline"
                to={`/jewellery/product/${product.prod_id}`}
              >
                <button className="btn w-full px-3 py-2 text-sm bg-gray-100 text-gray-900 border-none rounded-lg hover:bg-gray-200 transition-colors">
                  View Details
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PItem;