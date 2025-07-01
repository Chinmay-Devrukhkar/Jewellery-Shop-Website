import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setExpandedMenu(menu);
  };

  const handleMouseLeave = (e) => {
    if (!e.relatedTarget || typeof e.relatedTarget.closest !== "function") {
      setExpandedMenu(null);
      return;
    }

    const isMovingWithinMenu =
      e.relatedTarget.closest(".navlink") || e.relatedTarget.closest(".dropbox");

    if (!isMovingWithinMenu) {
      timeoutRef.current = setTimeout(() => {
        setExpandedMenu(null);
      }, 200);
    }
  };

  return (
    <nav className="bg-gray-100 border-b mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex justify-center space-x-8 py-3">
          {/* Categories with dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('categories')}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink 
              to=""
              className={({ isActive }) =>
                `inline-block no-underline  text-stone-800 hover:text-gold-600 transition py-2 ${
                  isActive ? 'text-gold-600' : ''
                }`
              }
            >
              Categories
            </NavLink>
            {expandedMenu === 'categories' && (
              <div className="dropbox absolute top-full left-0 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                <NavLink 
                  to="/jewellery/allproducts" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  All Jewellery
                </NavLink>
                <NavLink 
                  to="/jewellery/Ring" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Rings
                </NavLink>
                <NavLink 
                  to="/jewellery/Necklace" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Necklaces
                </NavLink>
                <NavLink 
                  to="/jewellery/Bracelet" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Bracelets
                </NavLink>
                <NavLink 
                  to="/jewellery/Pendant" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Pendants
                </NavLink>
                <NavLink 
                  to="/jewellery/Mangalsutra" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Mangalsutra
                </NavLink>
                <NavLink 
                  to="/jewellery/Earrings" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Earrings
                </NavLink>
                <NavLink 
                  to="/jewellery/Chain" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Chains
                </NavLink>
                <NavLink 
                  to="/jewellery/Bangle" 
                  className="block no-underline px-4 py-2  text-stone-800 hover:bg-gray-50"
                >
                  Bangles
                </NavLink>
              </div>
            )}
          </div>

          {/* Other navigation links */}
          <NavLink 
            to="/jewellery/Pendant" 
            className={({ isActive }) =>
              ` text-stone-800 no-underline hover:text-gold-600 transition py-2 ${
                isActive ? 'text-gold-600' : ''
              }`
            }
          >
            Pendants
          </NavLink>
          <NavLink 
            to="/jewellery/Earrings" 
            className={({ isActive }) =>
              ` text-stone-800 no-underline hover:text-gold-600 transition py-2 ${
                isActive ? 'text-gold-600' : ''
              }`
            }
          >
            Earrings
          </NavLink>
          <NavLink 
            to="/jewellery/Ring" 
            className={({ isActive }) =>
              ` text-stone-800 no-underline hover:text-gold-600 transition py-2 ${
                isActive ? 'text-gold-600' : ''
              }`
            }
          >
            Rings
          </NavLink>
          <NavLink 
            to="/jewellery/Mangalsutra" 
            className={({ isActive }) =>
              ` text-stone-800 no-underline hover:text-gold-600 transition py-2 ${
                isActive ? 'text-gold-600' : ''
              }`
            }
          >
            Mangalsutra
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;