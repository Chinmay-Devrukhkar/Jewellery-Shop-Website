import React,{useContext} from 'react'
import Header from '../Components/Header'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer/Footer'
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { ProductContext } from '../Context/ProductContext';
import ImageSlider from '../Components/ImageSlider';
import PItem from '../Components/PItem';
import { CartContext } from '../Context/CartContext';

export default function ProductDetail() {
  const {addToCart} = useContext(CartContext);
  const { productId } = useParams();
  const { products } = useContext(ProductContext);
  const navigate = useNavigate();
  
  // Find the product using productId
  const product = products.find(p => p.prod_id === parseInt(productId));
  // const product = products[parseInt(productId)-1];
  if (!product) return <p>Product not found</p>;

   // Filter related products (same category, excluding current product)
   const relatedProducts = products.filter(p => 
    p.category === product.category && p.prod_id !== product.prod_id
  ).slice(0, 4); // Limit to 4 related products 

  function buyNow(productItem){
    addToCart(productItem);
    navigate("/cart");
  }

return (
  <>
    <Header />
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 bg-white rounded-lg shadow-md border border-stone-200 p-4 sm:p-6 lg:p-8">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[600px] ">
          <ImageSlider 
            images={product.images} 
            height='100%' 
            width='100%'
            className=" h-full"
          />
        </div>
        
        {/* Product Details Section */}
        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
          {/* Product Title and Price */}
          <div className="border-b border-stone-200 pb-4 sm:pb-6">
            <h1 className="text-2xl sm:text-3xl font-light text-stone-800 mb-2 sm:mb-4">{product.name}</h1>
            <p className="text-xl sm:text-2xl text-stone-700">₹{product.price}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-2 sm:py-4">
            <button 
            onClick={() => addToCart(product)}
            className="btn w-full border-none sm:w-auto px-6 sm:px-8 py-3 bg-[#C8A055] text-white font-medium rounded hover:bg-[#B08B45] transition-colors shadow-sm text-sm sm:text-base">
              Add to Cart
            </button>
            <button 
            onClick={() => buyNow(product)}
            className="btn w-full border-none sm:w-auto px-6 sm:px-8 py-3 bg-stone-800 text-white font-medium rounded hover:bg-stone-700 transition-colors shadow-sm text-sm sm:text-base">
              Buy Now
            </button>
          </div>
          
          {/* Product Description */}
          <div className="border-t border-stone-200 pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-medium text-stone-800 mb-2 sm:mb-3">Product Description</h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{product.descrp}</p>
          </div>
          
          {/* Product Specifications */}
          <div className="border-t border-stone-200 pt-4 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-medium text-stone-800 mb-3 sm:mb-4">Product Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-y-3 text-stone-600">
              <div className="space-y-2 sm:space-y-3">
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-medium min-w-20">Metal:</span>
                  <span>{product.metal}</span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-medium min-w-20">Category:</span>
                  <span>{product.category}</span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-medium min-w-20">Gender:</span>
                  <span>{product.gender}</span>
                </p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-medium min-w-20">Weight:</span>
                  <span>{product.weight}g</span>
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-medium min-w-20">
                    {product.krt_purt === 925 ? 'Purity' : 'Karat'}:
                  </span>
                  <span>
                    {product.krt_purt === 925 ? `${product.krt_purt}` : `${product.krt_purt}K`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
         {/* Related Products Section */}
         {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <div className="flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#C8A055] font-light">
                Related Products
              </h2>
              <div className="mt-2 sm:mt-3 lg:mt-4">
                <div className="w-16 sm:w-24 lg:w-32 h-px bg-[#C8A055]"></div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 lg:mt-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <PItem key={relatedProduct.prod_id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
    <Footer />
  </>
);  }