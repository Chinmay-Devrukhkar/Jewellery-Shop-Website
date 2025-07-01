import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Load cart based on authentication status
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      
      // Only proceed if authentication state is determined (not null)
      if (isAuthenticated === null) {
        setIsLoading(false);
        return;
      }
      
      if (isAuthenticated && user) {
        // User is logged in, fetch cart from database
        try {
          const response = await fetch("http://localhost:3000/api/cart", {
            credentials: "include"
          });
          
          if (response.ok) {
            const data = await response.json();
            setCart(data.cart || []);
          } else {
            console.error("Failed to fetch cart from server");
            // Fall back to local storage if server fetch fails
            const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(savedCart);
          }
        } catch (error) {
          console.error("Error loading cart from server:", error);
          // Fall back to local storage if server fetch fails
          const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
          setCart(savedCart);
        }
      } else {
        // User is not logged in, use local storage
        try {
          const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
          setCart(savedCart);
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
          setCart([]);
        }
      }
      
      setIsLoading(false);
    };
    
    // Only load cart if authentication state is determined
    loadCart();
  }, [isAuthenticated, user]); // Re-run when auth status or user changes
  
  // Save cart to appropriate storage
  useEffect(() => {
    // Skip if still loading or authentication state is undetermined
    if (isLoading || isAuthenticated === null) {
      return;
    }
    
    if (isAuthenticated && user) {
      // If authenticated, send cart to server
      saveCartToServer(cart);
    } else if (!isAuthenticated) {
      // If not authenticated, save to local storage
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated, isLoading, user]);
  
  // Function to save cart to the server
  const saveCartToServer = async (cartItems) => {
    if (!user || !user.id) {
      console.error("No user ID available for saving cart");
      return;
    }
    
    try {
      await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cart: cartItems }),
      });
    } catch (error) {
      console.error("Error saving cart to server:", error);
    }
  };
  
  // When user logs in, merge local cart with server cart
  useEffect(() => {
    if (isAuthenticated && user) {
      const mergeLocalCartWithServer = async () => {
        try {
          // Get local cart
          const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          
          if (localCart.length > 0) {
            // Merge with server
            const response = await fetch("http://localhost:3000/api/cart/merge", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ localCart }),
            });
            
            if (response.ok) {
              const data = await response.json();
              setCart(data.cart);
              // Clear local storage after successful merge
              localStorage.removeItem("cart");
            } else {
              console.error("Error response from server while merging carts");
            }
          }
        } catch (error) {
          console.error("Error merging carts:", error);
        }
      };
      
      mergeLocalCartWithServer();
    }
  }, [isAuthenticated, user]); // Run when user logs in and user object is available
  
  // Add item to cart
  const addToCart = async (product) => {
    if (!product || !product.prod_id) {
      console.error("Cannot add product without ID to cart:", product);
      return;
    }

    
    // Update local state first for immediate UI feedback
    
    // If authenticated, add to server first
  if (isAuthenticated && user) {
    try {
      const response = await fetch("http://localhost:3000/api/cart/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ productId: product.prod_id }),
      });
      
      const data = await response.json();
      
      
      if (!response.ok) {
        console.error("Failed to add item to server cart:", data.message);
        // Don't update local state if server failed
        return;
      }
    } catch (error) {
      console.error("Error adding item to server cart:", error);
      // Don't update local state if request failed
      return;
    }
  }

  // Only update local state if server succeeded or user is not authenticated
  setCart((prevCart) => {
    // Check if item already exists
    const existingItem = prevCart.find((item) => item.prod_id === product.prod_id);
    if (existingItem) {
      // Don't add duplicates
      return prevCart;
    } else {
      // Add new item
      return [...prevCart, product];
    }
  });
  };
  
  // Remove item from cart
  const removeFromCart = async (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.prod_id !== id));
    
    
    // If authenticated, also remove from server directly
    if (isAuthenticated && user) {
      try {
        const response = await fetch(`http://localhost:3000/api/cart/item/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        
        if (!response.ok) {
          console.error("Failed to remove item from server cart:", await response.json());
        }
      } catch (error) {
        console.error("Error removing item from server cart:", error);
      }
    }
  };
  
  // Clear cart
  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    
    if (isAuthenticated && user) {
      try {
        await fetch("http://localhost:3000/api/cart", {
          method: "DELETE",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error clearing server cart:", error);
      }
    }
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export { CartContext };