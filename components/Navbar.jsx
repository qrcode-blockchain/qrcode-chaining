"use client"
import React,{useState} from 'react';
import { QrCode, Menu, X } from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=''>
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-5">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <QrCode className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold text-[#001A32]">QR Chain</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
          <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-[#EFF7FE] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Login
              </button>
            <button className="px-6 py-2 border-2 border-blue-600 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Signup
              </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              className="w-full border-2 border-[#0080F6] text-[#0080F6]  px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
            <button 
              className="w-full border-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Signup
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;