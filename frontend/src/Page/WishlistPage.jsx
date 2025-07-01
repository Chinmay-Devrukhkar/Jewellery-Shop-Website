import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import { WishContext } from '../Context/WishContext'; // Import the WishContext

const WishlistPage = () => {
  // Use the WishContext directly
  const { wishlist, removeFromWishlist } = useContext(WishContext);
  
  // // Sample wishlist data for display purposes (as fallback)
  // const sampleWishlistItems = [
  //   {
  //     prod_id: '1',
  //     name: 'Fashionable Diamond Bangle',
  //     price: 30000,
  //     category: 'Bangle',
  //     description: 'Premium quality leather jacket with a timeless design. Features durable material and excellent craftsmanship for long-lasting wear.',
  //     images: ['https://i.postimg.cc/0Nd9FvY0/bngl1-1.webp'],
  //     added_at: '2025-03-15T10:30:00Z'
  //   },
  //   {
  //     prod_id: '2',
  //     name: 'Hall of Fame Bracelet',
  //     price: 12000,
  //     category: 'Braclet',
  //     description: 'Comfortable and versatile white sneakers that go with any outfit. Made with breathable materials and cushioned insoles.',
  //     images: ['https://i.postimg.cc/bJyqj5Lc/brclt1.jpg'],
  //     added_at: '2025-03-20T14:45:00Z'
  //   },
  //   {
  //     prod_id: '3',
  //     name: 'Contemporary Clean Bangle',
  //     price: 26000,
  //     category: 'Bangle',
  //     description: 'Elegant minimalist watch with a stainless steel case and leather strap. Water-resistant and features a Japanese quartz movement.',
  //     images: ['https://i.postimg.cc/mk7jNdfk/contemporaryclnbnlg2-1.webp'],
  //     added_at: '2025-03-25T09:15:00Z'
  //   },
  //   {
  //     prod_id: '4',
  //     name: 'Dainty Sublime Nosepin',
  //     price: 5000,
  //     category: 'Nosepin',
  //     description: 'High-quality designer sunglasses with UV protection. Features a classic design that suits most face shapes.',
  //     images: ['https://i.postimg.cc/rm0QzVfS/dainty-Sublime-Nosepin1-1.webp'],
  //     added_at: '2025-03-28T16:20:00Z'
  //   }
  // ];

  // Use the real wishlist if it exists and has items, otherwise use sample data
  const displayItems = wishlist && wishlist.length > 0 ? wishlist : sampleWishlistItems;

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <>
    <Header/>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center">My Wishlist</h1>

      {displayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg mb-6">Your wishlist is empty</p>
          <NavLink to="/shop" className="btn no-underline bg-[#C8A055] text-white py-2 px-6 rounded hover:bg-gray-800 transition">
            Continue Shopping
          </NavLink>
        </div>
      )}

      {displayItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {/* product cards */}
          {displayItems.map((item) => (
            <div key={item.prod_id} className="group flex flex-col h-full">
              {/* Image Container - Updated for better mobile display */}
              <div 
                className="relative aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden"
              >
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : "/api/placeholder/300/300"}
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
                  
              </div>

              {/* Product Info - Adjusted spacing for mobile */}
              <div className="flex flex-col flex-grow">
                <div className="text-center mb-3">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.category}</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">₹{item.price}</p>
                </div>

                {/* Buttons Container - Improved mobile layout */}
                <div className="mt-auto">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRemoveItem(item.prod_id)}
                      className="btn w-full px-3 py-2 bg-[#C8A055] text-white text-sm border-none rounded-lg hover:bg-[#bf8a28] transition-colors flex items-center justify-center gap-1">
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                    <NavLink
                      className="w-full no-underline"
                      to={`/jewellery/product/${item.prod_id}`}
                    > 
                      <button className="btn w-full px-3 py-2 text-sm bg-gray-100 text-gray-900 border-none rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </NavLink>
                  </div>
                </div>
              </div>
          </div>
          ))}
          </div>
        </div>
      )}

      {displayItems.length >0 && (
        <div className="text-center">
          <NavLink to="/" className="btn no-underline">
            <button className='btn bg-[#C8A055] text-sm text-white p-2 rounded-lg border-none hover:bg-[#bf8a28] transition'>
            Continue Shopping
            </button>
          </NavLink>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default WishlistPage;