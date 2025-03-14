import React from 'react';
import { 
  QrCode, 
  Boxes, 
  Factory, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin,
  Twitter,
  Facebook,
  ArrowUpRight,
  Shield,
  Clock,
  Cpu
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'QR Solutions', href: '#' },
    { name: 'Blockchain Integration', href: '#' },
    { name: 'Supply Chain', href: '#' },
    { name: 'Enterprise Plans', href: '#' },
  ];

  const features = [
    { icon: Shield, text: 'Secure Authentication' },
    { icon: Clock, text: 'Real-time Tracking' },
    { icon: Cpu, text: 'Smart Contracts' }
  ];

  return (
    <footer className="bg-[#090727] text-white pt-16 pb-8 rounded-t-[48px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 border-b border-gray-700 pb-12">
          {features.map((feature, index) => (
            <div 
              key={feature.text}
              className="group flex items-center space-x-4 p-6 rounded-lg 
                       bg-opacity-10 bg-white hover:bg-opacity-20 
                       transform hover:scale-105 transition-all duration-300"
            >
              <feature.icon className="w-8 h-8 text-blue-400 group-hover:text-blue-300 
                                   animate-pulse" />
              <span className="text-lg font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Boxes className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold">QRChain</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering manufacturers with next-generation QR and blockchain solutions 
              for transparent, secure, and efficient supply chain management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="group flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 
                                         transform group-hover:translate-x-1 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <a href="mailto:contact@qrchain.com" 
                 className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@qrcipher.in</span>
              </a>
              <a href="tel:+1234567890" 
                 className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+91 9867219955</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Bandra West, Mumbai, Maharashtra 400050</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-10 
                         border border-gray-700 focus:border-blue-400 
                         focus:ring-1 focus:ring-blue-400 
                         transition-colors duration-200
                         placeholder-gray-400 text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 
                         transform hover:scale-105 transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 QRChain. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {[Linkedin, Twitter, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transform hover:scale-110 
                           transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;