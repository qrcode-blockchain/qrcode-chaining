'use client'
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { QrCode, Shield, Smartphone, ArrowRight, Lock } from 'lucide-react';
import { BrandGoogle} from "tabler-icons-react";
// import { Button } from '@/components/ui/button';
import { Button } from '@react-email/components';
const AnimatedConsumerSignup = () => {
  const [isScanning, setIsScanning] = useState(true);
  
  const [isHovered, setIsHovered] = useState(false);
  // Toggle scanning animation every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSignin = () => {
    signIn('google', {
      callbackUrl: '/dashboard'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-blue-400/20 shadow-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Animation */}
            <div className="relative h-[500px] flex items-center justify-center">
              {/* Phone Frame */}
              <div className="relative w-[280px] h-[560px] border-[12px] border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-sm">
                {/* Screen Content */}
                <div className="absolute inset-0 bg-black/80 rounded-[2rem] overflow-hidden">
                  {/* Scanning Animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* QR Code Frame */}
                    <div className="relative w-48 h-48 border-2 border-blue-400/50 rounded-lg">
                      <div className={`absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent transform transition-transform duration-1000 ease-in-out ${isScanning ? 'translate-y-0' : 'translate-y-full'}`} />
                      
                      {/* Scanning Line */}
                      <div className={`absolute left-0 right-0 h-0.5 bg-blue-400 transform transition-transform duration-1000 ease-in-out ${isScanning ? 'translate-y-0' : 'translate-y-full'}`} />
                      
                      {/* Corner Markers */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                      
                      {/* Sample QR Code */}
                      <div className="absolute inset-8 opacity-50">
                        <QrCode className="w-full h-full text-blue-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Text */}
                  <div className="absolute bottom-12 left-0 right-0 text-center">
                    <p className="text-blue-400 font-medium animate-pulse">
                      {isScanning ? "Scanning..." : "Verified ✓"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-12 left-0 transform -translate-x-1/2 animate-float-slow">
                  <div className="bg-blue-500/20 backdrop-blur-md p-3 rounded-xl">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="absolute bottom-12 right-0 transform translate-x-1/2 animate-float delay-150">
                  <div className="bg-blue-500/20 backdrop-blur-md p-3 rounded-xl">
                    <Lock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">
                  Verify Products
                  <span className="block text-blue-400 mt-2">In Seconds</span>
                </h1>
                <p className="text-gray-300 text-lg">
                  Join our community of conscious consumers. Simply scan, verify, and shop with confidence.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-6">
                {[
                  { icon: <Smartphone className="h-5 w-5" />, text: "Open your camera" },
                  { icon: <QrCode className="h-5 w-5" />, text: "Scan product QR code" },
                  { icon: <Shield className="h-5 w-5" />, text: "Get instant verification" }
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="bg-blue-500/20 p-3 rounded-full">
                      {step.icon}
                    </div>
                    <p className="text-white">{step.text}</p>
                    {index < 2 && <ArrowRight className="h-4 w-4 text-blue-400" />}
                  </div>
                ))}
              </div>

              {/* Sign In Button */}
              
              <div className="relative flex flex-col space-y-4">
                  <button
                    onClick={handleGoogleSignin}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative px-8 py-4 bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#111827] 
rounded-xl backdrop-blur-xl border border-blue-500/40 group-hover:border-blue-500/60 
shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`absolute inset-0 bg-blue-500/10 rounded-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    
                    <div className="relative flex items-center justify-center space-x-4">
                      <div className="bg-white p-2 rounded-full">
                      <BrandGoogle size={24} className="text-blue-500" />
                      </div>
                      <span className="text-white font-medium">Continue with Google</span>
                    </div>
                  </button>
                </div>
              <p className="text-sm text-gray-400 text-center">
                We only request essential permissions to verify your identity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedConsumerSignup;