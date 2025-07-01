import React from 'react';
import { NavLink } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#C8A055] mt-auto">
      <div className="max-w-7xl mx-auto pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center text-center">
          {/* Contact Section */}
          <div className="space-y-4 w-full max-w-xs">
            <h3 className="text-white text-lg font-medium tracking-wide">Contact</h3>
            <div className="space-y-3 text-white text-sm">
              <p className="flex items-start justify-center">
                <span className="mr-3 mt-0.5"><MapPin size={16} /></span>
                <span>Rajaram Yadav Chawl, opp. Shivaji Statue,<br/>
                New Agripada, Santacruz(East),<br/>
                Mumbai, Maharashtra-400055</span>
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-3"><Phone size={16} /></span>
                <span>+91 9969181643</span>
              </p>
              <p className="flex items-center justify-center">
                <span className="mr-3"><Phone size={16} /></span>
                <span>+91 8356964719</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 w-full max-w-xs">
            <h3 className="text-white text-lg font-medium tracking-wide">Quick Links</h3>
            <div className="space-y-3 text-sm">
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                About Us
              </NavLink>
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                Contact Us
              </NavLink>
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                FAQs
              </NavLink>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4 w-full max-w-xs">
            <h3 className="text-white text-lg font-medium tracking-wide">Policies</h3>
            <div className="space-y-3 text-white text-sm">
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                Privacy Policy
              </NavLink>
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                Terms & Conditions
              </NavLink>
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                Refund Policy
              </NavLink>
              <NavLink to="/infopage" className="block text-white no-underline hover:text-white transition-colors duration-200">
                Shipping Policy
              </NavLink>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-2 pt-8">
          <hr className=" border-white" />
          <p className="text-white pt-4 text-sm text-center">
            © {new Date().getFullYear()} Abhushan Jewellers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;