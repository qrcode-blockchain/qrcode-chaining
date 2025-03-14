import React from 'react';
import { QrCode, Shield, Link, Factory } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/7289717/pexels-photo-7289717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Manufacturing Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-black/85 to-blue-900/95" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold backdrop-blur-sm">
                   Industry 4.0 Ready
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white space-y-3">
              <span className="block">Transform Your</span>
              <span className="block text-blue-400">Manufacturing</span>
              <span className="block">with Blockchain QR</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-xl">
              Revolutionize your manufacturing process with tamper-proof QR codes backed by blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Start Implementation
              </button>
              <button className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>

          {/* Right Floating Elements - Optimized Layout */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Connecting Lines SVG - Optimized Positions */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
              <line 
                x1="25%" y1="25%" 
                x2="50%" y2="50%" 
                className="animate-draw-slow stroke-blue-400/40" 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line 
                x1="75%" y1="25%" 
                x2="50%" y2="50%" 
                className="animate-draw-slow stroke-blue-400/40" 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line 
                x1="25%" y1="75%" 
                x2="50%" y2="50%" 
                className="animate-draw-slow stroke-blue-400/40" 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <line 
                x1="75%" y1="75%" 
                x2="50%" y2="50%" 
                className="animate-draw-slow stroke-blue-400/40" 
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Floating Elements - Optimized Positions */}
            <div className="absolute top-[25%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 animate-float-slow">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <QrCode className="h-10 w-10 text-blue-400" />
                <p className="text-white mt-2 font-medium">Smart QR</p>
              </div>
            </div>

            <div className="absolute top-[25%] right-[25%] transform translate-x-1/2 -translate-y-1/2 animate-float delay-150">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <Shield className="h-10 w-10 text-blue-400" />
                <p className="text-white mt-2 font-medium">Security</p>
              </div>
            </div>

            <div className="absolute bottom-[25%] left-[25%] transform -translate-x-1/2 translate-y-1/2 animate-float-slow delay-300">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <Link className="h-10 w-10 text-blue-400" />
                <p className="text-white mt-2 font-medium">Blockchain</p>
              </div>
            </div>

            <div className="absolute bottom-[25%] right-[25%] transform translate-x-1/2 translate-y-1/2 animate-float delay-450">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                <Factory className="h-10 w-10 text-blue-400" />
                <p className="text-white mt-2 font-medium">Industry 4.0</p>
              </div>
            </div>

            {/* Central Element - Enhanced */}
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                <div className="relative bg-blue-600/20 backdrop-blur-md p-8 rounded-full shadow-xl border border-blue-400/30">
                  <div className="bg-blue-400/20 rounded-full p-4">
                    <QrCode className="h-16 w-16 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-blue-400/20">
          {[
            { label: "Success Rate", value: "99.9%" },
            { label: "Secured Products", value: "5K+" },
            { label: "Trust Score", value: "98%" },
            { label: "Global Manufacturers", value: "5+" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-blue-400">{stat.value}</p>
              <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;


