import React from 'react';
import { 
  QrCode, 
  BarChart3, 
  Shield, 
  Factory,
  ArrowRight,
  CheckCircle,
  Boxes
} from 'lucide-react';

const CTASection = () => {
  const benefits = [
    { icon: Shield, text: "Enhanced Security & Authenticity" },
    { icon: BarChart3, text: "Real-time Supply Chain Insights" },
    { icon: Factory, text: "Streamlined Manufacturing Process" }
  ];

  return (
    <div className="bg-gradient-to-br from-[#090727] via-[#1a1744] to-[#090727] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 top-10 w-72 h-72 bg-blue-500/10 rounded-full 
                        blur-3xl animate-pulse" />
          <div className="absolute -left-10 bottom-10 w-72 h-72 bg-purple-500/10 rounded-full 
                        blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Transform Your Manufacturing
                <span className="text-blue-400"> With Blockchain QR Integration</span>
              </h2>
              <p className="text-lg text-gray-300">
                Enhance your supply chain transparency, reduce counterfeiting, and gain real-time 
                insights with our advanced QR-Blockchain solution.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 text-gray-200 group"
                >
                  <benefit.icon className="w-6 h-6 text-blue-400 group-hover:scale-110 
                                       transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg 
                               text-white font-semibold flex items-center justify-center 
                               space-x-2 group transform hover:scale-105 transition-all 
                               duration-300">
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-gray-600 hover:border-blue-400 
                               rounded-lg text-white font-semibold flex items-center 
                               justify-center space-x-2 group hover:bg-white/5 
                               transition-all duration-300">
                <span>Schedule Demo</span>
                <Factory className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Animation */}
          <div className="relative">
            {/* QR Code Grid Animation */}
            <div className="grid grid-cols-3 gap-4 animate-float1">
              {[...Array(9)].map((_, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 
                           rounded-lg p-4 backdrop-blur-sm border border-white/10 
                           hover:border-blue-400/50 transform hover:scale-105 
                           transition-all duration-300"
                >
                  <div className="h-full flex items-center justify-center">
                    {index % 2 === 0 ? (
                      <QrCode className="w-8 h-8 text-blue-400 animate-pulse" />
                    ) : (
                      <Boxes className="w-8 h-8 text-purple-400 animate-pulse delay-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Overlay */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                          bg-white/10 backdrop-blur-md rounded-2xl p-6 w-5/6 
                          border border-white/20">
              <div className="flex justify-between text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-gray-300">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50%</div>
                  <div className="text-sm text-gray-300">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-gray-300">Real-time Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;