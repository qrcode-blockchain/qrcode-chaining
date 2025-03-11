import React from 'react';
import { 
  Scan, 
  Binary, 
  ShieldCheck, 
  Factory, 
  History,
  BarChart2,
  Smartphone,
  Network,
  Fingerprint,
  Settings
} from 'lucide-react';

const ServiceCard = ({ title, description, icon: Icon, features }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
          {features && (
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-500">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Advanced QR Integration",
      description: "Enterprise-grade QR solution designed specifically for manufacturing lines",
      icon: Scan,
      features: [
        "Dynamic QR code generation",
        "Real-time batch tracking",
        "Production line integration"
      ]
    },
    {
      title: "Blockchain Security",
      description: "Military-grade blockchain infrastructure for immutable product tracking",
      icon: Binary,
      features: [
        "Distributed ledger technology",
        "Smart contract automation",
        "Secure hash verification"
      ]
    },
    {
      title: "Authentication System",
      description: "Multi-layer authentication protocol for product verification",
      icon: ShieldCheck,
      features: [
        "Anti-counterfeit measures",
        "Digital signatures",
        "Encrypted tracking codes"
      ]
    },
    {
      title: "Production Integration",
      description: "Seamless integration with existing manufacturing systems",
      icon: Factory,
      features: [
        "ERP system compatibility",
        "Automated data sync",
        "Real-time monitoring"
      ]
    },
    {
      title: "Supply Chain Tracking",
      description: "End-to-end visibility of your product journey",
      icon: History,
      features: [
        "Real-time location tracking",
        "Temperature monitoring",
        "Chain of custody verification"
      ]
    },
    {
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for manufacturing insights",
      icon: BarChart2,
      features: [
        "Production metrics",
        "Performance analytics",
        "Predictive maintenance"
      ]
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Enterprise Solutions for Modern Manufacturing
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive QR and blockchain solutions designed to revolutionize 
            your manufacturing process with enhanced security and traceability.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              features={service.features}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <span>Get Started Today</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;