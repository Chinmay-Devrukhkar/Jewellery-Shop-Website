import React, { useContext, useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { AuthContext } from '../App';
import { CartContext } from '../Context/CartContext';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import axios from 'axios'; // Make sure axios is installed

const CartPage = () => {
  const { cart, removeFromCart, clearCart, isLoading } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    
    loadRazorpayScript();
    
    // Cleanup function to remove the script when component unmounts
    return () => {
      const scriptTag = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const calculateDiscount = () => {
    return cart.reduce((total, item) => 
      total + ((item.price * item.discount) / 100), 0
    );
  };

  const finalAmount = () => {
    return calculateTotal() - calculateDiscount();
  };

  // Razorpay payment handler
  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("Please log in to place an order");
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Create order on the backend
      const { data } = await axios.post('/api/payment/create-order', {
        amount: finalAmount(),
        cartItems: cart
      });
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }
      
      const options = {
        key: data.key_id,
        amount: data.order.amount, // Amount in paisa
        currency: data.order.currency,
        name: "Abhushan Jewellers", 
        description: "Jewelry Purchase",
        image: logo,
        order_id: data.order.id,
        
        prefill: {
          name: user?.fullName || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9876543210"
        },
        
        notes: {
          address: "Customer Address"
        },
        
        theme: {
          color: "#C8A055"
        },
        
        handler: async function (response) {
          try {
            // Verify payment with backend
            const verifyResponse = await axios.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                amount: finalAmount(),
                products: cart.map(item => item.prod_id)
              }
            });
            
            if (verifyResponse.data.success) {
              alert(`Payment successful! Your order #${verifyResponse.data.orderId} has been placed.`);
              clearCart();
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setProcessingPayment(false);
          }
        },
        
        modal: {
          ondismiss: function() {
            console.log("Payment canceled by user");
            setProcessingPayment(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("Payment processing failed. Please try again later.");
      setProcessingPayment(false);
    }
  };

  // Loading state
  if (isLoading || processingPayment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A055]"></div>
              {processingPayment && <p className="ml-4">Processing payment...</p>}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Cart Items Section */}
            <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">Shopping Cart</h1>
                  <span className="text-sm text-gray-500">({cart.length} items)</span>
                </div>
                
                {isAuthenticated ? (
                  <div className="text-sm text-gray-500">
                    Shopping as <span className="font-medium">{user?.fullName || user?.email}</span>
                  </div>
                ) : (
                  <div className="text-sm">
                    <NavLink to="/login" className="text-[#C8A055] hover:underline">
                      Log in
                    </NavLink>
                    <span className="text-gray-500"> to save your cart</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {cart.length < 1 ? (
                  <div className="flex flex-col justify-center items-center p-20">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <NavLink 
                      to="/" 
                      className="btn bg-[#C8A055] no-underline text-white px-4 py-2 rounded-lg hover:bg-[#B89045] transition-colors"
                    >
                      Continue Shopping
                    </NavLink>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.prod_id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100">
                        <div className="sm:w-32 sm:h-32 flex-shrink-0">
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.krt_purt === 925 ? `${item.krt_purt}` : `${item.krt_purt}K`}, {item.metal}
                            </p>
                          </div>

                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                ₹{item.price}
                              </div>
                              {item.discount > 0 && (
                                <>
                                  <div className="text-sm text-gray-500 line-through">
                                    ₹{(item.price * (100 / (100 - item.discount))).toFixed(2)}
                                  </div>
                                  <div className="text-sm text-green-600">
                                    Save ₹{((item.price * item.discount) / (100 - item.discount)).toFixed(2)}
                                  </div>
                                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-[#C8A055] bg-[#C8A055]/10 rounded-full">
                                    {item.discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>

                            <button 
                              className="text-gray-400 border-none bg-white hover:text-red-500 transition-colors"
                              title="Remove From Cart"
                              onClick={() => removeFromCart(item.prod_id)}
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={clearCart}
                        className="btn flex items-center border-none rounded-lg px-2 py-2 gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} /> Clear Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary Section */}
            {cart.length > 0 && (
              <div className="lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Total MRP</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span className="text-green-600">- ₹{calculateDiscount().toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>₹{finalAmount().toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      className="btn w-full bg-[#C8A055] border-none text-white py-4 rounded-xl text-sm font-medium hover:bg-[#B89045] transition-colors"
                      onClick={handlePayment}
                      disabled={processingPayment}
                    >
                      {isAuthenticated ? "Pay Now" : "Login to Checkout"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;