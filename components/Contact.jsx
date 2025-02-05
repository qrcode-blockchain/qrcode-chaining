"use client"
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram,
  Send
} from 'lucide-react';

// Map component
//https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d[zoom]!2d[longitude]!3d[latitude]!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x[place_id]!2m2!1d[longitude]!2d[latitude]
const MapComponent = () => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.9390558210313!2d-122.41941482393491!3d37.77492901975435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter+HQ!5e0!3m2!1sen!2sin!4v1523265661673"
      className="w-full h-full rounded-lg"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Get in touch with us for QR code and Blockchain solutions
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-xl p-8 transform transition duration-500 hover:scale-105">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="7"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map and Contact Info */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-lg h-64 overflow-hidden shadow-xl">
              <MapComponent />
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p>Mumbai, Maharashtra, India</p>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <p>+91 9867219955</p>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <p>contact@qrblockchain.com</p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;