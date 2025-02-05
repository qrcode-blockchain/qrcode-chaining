'use client'
import React, { useState } from 'react';
import { 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Quote,
  Building2,
  Badge,
  Factory
} from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Production Manager",
      company: "TechManufacture Inc.",
      image: "/api/placeholder/80/80",
      content: "Implementing this QR-blockchain solution has transformed our supply chain visibility. We've seen a 40% reduction in counterfeit parts and improved customer trust significantly.",
      rating: 5,
      icon: Building2
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "Operations Director",
      company: "Global Industries Ltd.",
      image: "/api/placeholder/80/80",
      content: "The real-time tracking capabilities have revolutionized our inventory management. Integration was smooth, and the ROI has exceeded our expectations.",
      rating: 5,
      icon: Factory
    },
    {
      id: 3,
      name: "David Park",
      role: "Quality Assurance Head",
      company: "Precision Manufacturing Co.",
      image: "/api/placeholder/80/80",
      content: "Authentication of parts has never been easier. We've eliminated counterfeiting issues and our clients appreciate the transparency in our supply chain.",
      rating: 5,
      icon: Badge
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how manufacturers are transforming their operations with our blockchain-powered QR solution.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Large Quote Icon */}
          <div className="absolute -top-6 -left-4 text-blue-100">
            <Quote className="w-20 h-20 transform -scale-x-100" />
          </div>

          {/* Testimonial Card */}
          <div className="relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 transform hover:scale-[1.02]">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Company Icon and Rating */}
              <div className="text-center md:text-left">
                <div className="inline-block p-4 bg-blue-50 rounded-xl mb-4">
                  {React.createElement(testimonials[currentIndex].icon, {
                    className: "w-8 h-8 text-blue-500"
                  })}
                </div>
                <div className="flex justify-center md:justify-start space-x-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-gray-400 text-sm">Verified Customer</div>
              </div>

              {/* Testimonial Content */}
              <div className="md:col-span-2 space-y-4">
                <p className="text-gray-700 text-lg italic">
                  "{testimonials[currentIndex].content}"
                </p>
                <div className="border-t pt-4 mt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 
                       transform hover:scale-110 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 
                       transform hover:scale-110 transition-all duration-200"
            >
              <ArrowRight className="w-6 h-6 text-blue-600" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 
                          ${index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;