// contexts/ProductContext.js
import React, { createContext, useState, useEffect } from 'react';

const ProductContext = createContext(null);

  const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from your Node/PostgreSQL backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Your API endpoint
      const data = await response.json();
      setProducts(data);
      console.log("Products loaded in context:", data); // Debug log
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  //fetch product by category
  const fetchByCategory = async (category) =>{ //accept id as parameter
    try{
      const response =await fetch(`/api/${category}`); //pass id in url
      if(!response.ok){
        throw new Error("product not found");
      }
      const data = await response.json();
      return data;  // return the fetched product instead of updating state
    }
    catch(e){
      console.log("Error(fetch by id , data not found):",e);
    }
  }

  // Function to filter products
  const filterProducts = (category) => {
    return products.filter(product => product.category === category);
  };

  // Function to search products
  const searchProducts = (query) => {
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    fetchProducts();

  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,  
      filterProducts,
      searchProducts,
      refreshProducts: fetchProducts,
      fetchByCategory,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
export { ProductContext };