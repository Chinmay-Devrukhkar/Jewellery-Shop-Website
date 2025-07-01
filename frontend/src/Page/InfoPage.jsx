import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar';

const InfoPage = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About Us' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'shipping', label: 'Shipping Policy' },
    { id: 'faq', label: 'FAQs' },
  ];

  return (
    <>
    <Header/>
    <Navbar/>
    <div className="bg-white min-h-screen">
      {/* Navigation Tabs */}
      <div className="bg-gray-200 sticky top-0 z-10">
        <div className="container mx-auto justify-center flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 border-none text-sm font-medium whitespace-nowrap transition-colors duration-200 
                ${activeTab === tab.id 
                ? 'text-black bg-white border-b-2 border-gray-400' 
                : 'text-black hover:bg-gray-300'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black border-b border-gray-200 pb-2">About Us</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <p className="mb-4 text-black">
                    Welcome to Abhushan Jewellers, your trusted destination for exquisite jewellery crafted with passion and precision. 
                    Led by our founder and proprietor, Suhas M. Devrukhkar, we bring over two decades of expertise to every creation. With a journey 
                    that began in the jewellery industry in 1997, Mr. Devrukhkar's vision materialized into a full-fledged enterprise when Abhushan Jewellers 
                    opened its doors in 2008.
                  </p>
                  <p className="mb-4 text-black">
                    Since our inception, we have been committed to offering jewellery that reflects both tradition and modernity.
                    Specializing in gold, diamond, silver, and gemstone jewellery, each of our designs is a harmonious blend of timeless artistry and
                    contemporary trends. From intricate bridal collections to elegant everyday wear, we cater to a variety of tastes and occasions.
                  </p>
                  <p className="mb-4 text-black">
                    At Abhushan Jewellers, we understand that jewellery is more than an ornament—it symbolizes life's most cherished moments. 
                    Every piece we create tells a story, crafted with care to celebrate your memories. We take pride in our quality, authenticity, and 
                    transparent pricing, ensuring you receive value in every purchase.
                  </p>
                  <p className="text-black">
                    With Suhas M. Devrukhkar's extensive experience and dedication,
                    Abhushan Jewellers has grown into a name trusted by generations of customers. Our journey is fueled by a passion for excellence, a
                    commitment to customer satisfaction, and a love for preserving the beauty of traditional craftsmanship while embracing innovation.
                    Experience the magic of jewellery like never before at Abhushan Jewellers—where every piece is a reflection of your elegance and a 
                    part of our legacy.
                  </p>
                </div>
                <div className="md:w-1/3">
                  <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100 p-4">
                    <h3 className="text-xl font-medium text-center text-black mb-3">Our Expertise</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-black text-lg">✧</span>
                        </div>
                        <span className="font-medium text-black">Gold Jewellery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-black text-lg">✧</span>
                        </div>
                        <span className="font-medium text-black">Diamond Jewellery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-black text-lg">✧</span>
                        </div>
                        <span className="font-medium text-black">Silver Jewellery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-black text-lg">✧</span>
                        </div>
                        <span className="font-medium text-black">Gemstone Jewellery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black border-b border-gray-200 pb-2">Privacy Policy</h2>
              <p className="mb-4 text-black">We at <strong>Abhushan Jewellers</strong> value your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Information Collected:</div>
                    <div className="text-black">Name, contact details, billing/shipping address, and payment info.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Usage:</div>
                    <div className="text-black">For order processing, customer support, marketing (if opted-in), and improving services.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Security:</div>
                    <div className="text-black">We use SSL encryption and secure servers to protect your data.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Sharing:</div>
                    <div className="text-black">We never sell your data. Shared only with delivery or payment partners as required.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Cookies:</div>
                    <div className="text-black">Used for a better user experience. You can opt out via browser settings.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Your Rights:</div>
                    <div className="text-black">You may request access, correction, or deletion of your data anytime.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Contact:</div>
                    <div className="text-black">Email us at <a href="mailto:privacy@abhushanjewellers.com" className="text-gray-700 hover:underline">privacy@abhushanjewellers.com</a> for any privacy-related queries.</div>
                  </li>
                </ul>
              </div>
            </div>  
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black border-b border-gray-200 pb-2">Terms & Conditions</h2>
              <p className="mb-4 text-black">By using our website, you agree to the following terms:</p>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Use of Website</h3>
                  <p className="text-black">Only for lawful purposes and in a manner that doesn't harm the site.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Product Availability</h3>
                  <p className="text-black">Subject to stock. We reserve the right to cancel unfulfilled orders.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Pricing</h3>
                  <p className="text-black">All prices are in INR. Prices may change without notice.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Intellectual Property</h3>
                  <p className="text-black">All content is owned by <strong>Abhushan Jewellers</strong>. No unauthorized copying or reuse allowed.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Limitation of Liability</h3>
                  <p className="text-black">We're not liable for any indirect damages from the use of our products or website.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Jurisdiction</h3>
                  <p className="text-black">Governed by the laws of India, with jurisdiction in Maharashtra.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black border-b border-gray-200 pb-2">Refund Policy</h2>
              <p className="mb-4 text-black">We strive for 100% customer satisfaction. If you're not happy, here's what you need to know:</p>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Eligibility:</div>
                    <div className="text-black">Refunds applicable only for damaged/defective products or incorrect items.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Timeframe:</div>
                    <div className="text-black">Request within <strong>7 days</strong> of receiving the product.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Conditions:</div>
                    <div className="text-black">Product must be unused, in original packaging with tags intact.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Process:</div>
                    <div className="text-black">Email your complaint with order ID and images to <a href="mailto:returns@abhushanjewellers.com" className="text-gray-700 hover:underline">returns@abhushanjewellers.com</a>.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Refund Mode:</div>
                    <div className="text-black">Refunds processed to original payment method within <strong>7-10 business days</strong>.</div>
                  </li>
                  <li className="flex gap-2">
                    <div className="font-bold min-w-40 text-black">Non-refundable Items:</div>
                    <div className="text-black">Customized or engraved jewellery.</div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black border-b border-gray-200 pb-2">Shipping Policy</h2>
              <p className="mb-4 text-black">We ensure safe and timely delivery across India.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Delivery Time</h3>
                  <p className="text-black">3–10 business days depending on location.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Shipping Charges</h3>
                  <p className="text-black">Free shipping on orders above ₹2,000. Otherwise, a nominal fee applies.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Order Tracking</h3>
                  <p className="text-black">Tracking link will be emailed once dispatched.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">International Shipping</h3>
                  <p className="text-black">Available for select countries. Contact customer service for details.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-black border-b border-gray-200 pb-2">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Q1. How do I place an order?</h3>
                  <p className="text-black">Visit our website, select the product, add to cart, and proceed to checkout.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Q2. Is COD available?</h3>
                  <p className="text-black">Yes, Cash on Delivery is available on select products and locations.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Q3. Do you offer customized jewellery?</h3>
                  <p className="text-black">Yes, contact us at <a href="mailto:custom@abhushanjewellers.com" className="text-gray-700 hover:underline">custom@abhushanjewellers.com</a> for custom orders.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Q4. How do I track my order?</h3>
                  <p className="text-black">You'll receive a tracking link via email/SMS once the order is dispatched.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Q5. What if I receive a damaged product?</h3>
                  <p className="text-black">Please email us with photos and your order ID within 48 hours for a replacement/refund.</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2 text-black">Q6. Can I cancel or modify my order?</h3>
                  <p className="text-black">Yes, if it's not shipped yet. Contact us immediately after placing the order.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default InfoPage;