import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const CategoryCard = ({ title, image, link }) => (
  <div className="group cursor-pointer flex flex-col h-full">
    <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
    <NavLink to={`/jewellery/${title}`} className='no-underline'>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
      />
       </NavLink> 
    </div>
    <div className="text-center mt-auto">
      <h3 className="text-lg text-[#C8A055] font-medium mb-2">{title}</h3>
      
        {/* <button className="flex border-none bg-transparent items-center justify-center text-gray-600 hover:text-[#C8A055] transition-colors">
          Explore <ChevronRight className="ml-1" size={16} /> 
        </button> */}
        
    </div>
  </div>
);

const GenderCard = ({ title, image,}) => (
  <div className="relative group  overflow-hidden rounded-lg h-full w-full">
    <div className="w-full h-[300px] md:h-[350px] lg:h-[400px]">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <div className="flex justify-between items-center text-white">
        <h3 className="text-lg md:text-xl font-medium">{title}</h3>
        <NavLink to={`/jewellery/allproducts?gender=${title}`} style={{all:'unset'}}>
          <button className="flex border-none bg-transparent text-white items-center group-hover:text-[#C8A055] transition-colors">
            Explore More <ChevronRight className="ml-1" size={16} />
          </button>
        </NavLink>
      </div>
    </div>
  </div>
);

const ShopSections = () => {
  const categories = [
    { title: 'Mangalsutra', image: 'src/assets/mgls.jpg' },
    { title: 'Earrings', image: 'src/assets/earring.jpg' },
    { title: 'Ring', image: 'src/assets/ring.jpg' },
    { title: 'Pendant', image: 'src/assets/pendant.jpg' },
    { title: 'Nosepin', image: 'src/assets/nosepin.jpg' }
  ];

  const genders = [
    { title: 'Men', image: '/src/assets/unblured.jpeg' },
    { title: 'Women', image: 'src/assets/women.jpg' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Shop By Category Section */}
      <div className="mb-12 sm:mb-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl text-[#C8A055] font-serif mb-2 sm:mb-3">Shop By Category</h2>
          <p className="text-gray-600 text-sm sm:text-base">Browse through your favorite categories. We've got them all!</p>
          <div className="mt-3 sm:mt-4 flex justify-center">
            <div className="w-24 sm:w-32 h-px bg-[#C8A055]"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>

      {/* Shop By Gender Section */}
      <div>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl text-[#C8A055] font-serif mb-2 sm:mb-3">Shop By Gender</h2>
          <p className="text-gray-600 text-sm sm:text-base">First-class Jewellery for first-class Men & Women</p>
          <div className="mt-3 sm:mt-4 flex justify-center">
            <div className="w-24 sm:w-32 h-px bg-[#C8A055]"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {genders.map((gender, index) => (
            <GenderCard key={index} {...gender} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopSections;