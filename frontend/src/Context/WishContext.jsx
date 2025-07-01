import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const WishContext = createContext();

// Create the provider component
export const WishProvider = ({ children }) => {
  // Initialize wishlist state from localStorage if available
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Function to check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.prod_id === productId);
  };

  // Function to add a product to the wishlist
  const addToWishlist = (product) => {
    if (!isInWishlist(product.prod_id)) {
      setWishlist([...wishlist, product]);
    }
    console.log("product  added to wishlist")
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.prod_id !== productId));
    console.log("product  removed from  wishlist")
  };

  // Function to toggle a product in the wishlist
  const toggleWishlist = (product) => {
    if (isInWishlist(product.prod_id)) {
      removeFromWishlist(product.prod_id);
    } else {
      addToWishlist(product);
    }
  };

  // Context value to be provided
  const contextValue = {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist
  };

  return (
    <WishContext.Provider value={contextValue}>
      {children}
    </WishContext.Provider>
  );
};
