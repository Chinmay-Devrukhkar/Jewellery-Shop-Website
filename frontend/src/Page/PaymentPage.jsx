import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { AuthContext } from '../App';
import { CartContext } from '../Context/CartContext';
import logo from '../assets/logo.jpg';
import axios from 'axios';

const PaymentPage = () => {
  const { cart, clearCart, isLoading } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  
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

  // Calculate totals (copied from CartPage)
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

  // Function to create an order on the backend
  const createOrder = async () => {
    try {
      // Get order data from backend
      const response = await axios.post('/api/payments/create-order', {
        amount: finalAmount() * 100, // Amount in paisa
        productIds: cart.map(item => item.prod_id)
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Send payment verification to backend
      const verifyResponse = await axios.post('/api/payments/verify', {
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        signature: paymentResponse.razorpay_signature,
        productIds: cart.map(item => item.prod_id),
        amount: finalAmount()
      });
      
      if (verifyResponse.data.success) {
        alert('Payment successful! Your order has been placed.');
        clearCart();
        navigate('/order-success'); // Redirect to success page
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('There was an issue with your payment. Please try again.');
    }
  };

  // Razorpay payment handler
  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("Please log in to place an order");
      navigate('/login');
      return;
    }

    try {
      // Get order data from backend
      const orderData = await createOrder();
      
      const options = {
        key: "rzp_test_QM727Ez45RjFVj", // Replace with your Razorpay test key
        amount: finalAmount() * 100, // Amount in paisa
        currency: "INR",
        name: "Abhushan Jewellers",
        description: "Jewelry Purchase",
        image: logo,
        order_id: orderData.id, // This comes from the backend
        
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
        
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        
        modal: {
          ondismiss: function() {
            console.log("Payment canceled by user");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("Payment gateway failed to load. Please try again later.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A055]"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Navbar />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            {/* Order Summary Section */}
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-sm p-6">
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
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;