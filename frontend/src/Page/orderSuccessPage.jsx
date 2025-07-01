import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>
          
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your purchase. We've received your order and will 
            process it as soon as possible.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/orders"
              className="btn bg-[#C8A055] text-white px-6 py-3 rounded-xl hover:bg-[#B89045] transition-colors"
            >
              View My Orders
            </NavLink>
            
            <NavLink
              to="/"
              className="btn bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;