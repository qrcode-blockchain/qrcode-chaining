"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Link as LinkIcon, 
  Factory, 
  Shield, 
  BarChart2, 
  QrCode, 
  Users, 
  Settings, 
  ScanLine,
  Check,
  X
} from "lucide-react";

export default function SideBarComponent() {
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch manufacturer's blockchain preference when component mounts
  useEffect(() => {
    const fetchBlockchainPreference = async () => {
      setIsLoading(true);
      try {
        console.log("The api is being hit");
        const response = await fetch('/api/manufacturers/preferences');
        console.log('The response is', response);
          
        const data = await response.json();
        console.log("The data is", data);
        
        if (data.success) {
          setUseBlockchain(data.preferences.useBlockchain || false);
        } else {
          console.error("Failed to fetch blockchain preference:", data.message);
        }
      } catch (error) {
        console.error("Error fetching blockchain preference:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlockchainPreference();
  }, []);
  
  console.log("The blockchain status is", useBlockchain);
  
  // Handle toggle change
  const handleBlockchainToggle = async () => {
    setIsLoading(true);
    try {
      const newValue = !useBlockchain;
      console.log("The new value is", newValue);
      
      // Update preference in the database
      const response = await fetch('/api/manufacturers/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useBlockchain: newValue }),
      });
      
      const data = await response.json();
      console.log("The data in toggle is", data);
      
      if (data.success) {
        setUseBlockchain(newValue);
      } else {
        console.error("Failed to update blockchain preference:", data.message);
      }
    } catch (error) {
      console.error("Error updating blockchain preference:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const services = [
    { name: "Overview", icon: <BarChart2 className="w-5 h-5" />, link: '/dashboard'},
    { name: "QR Creation", icon: <QrCode className="w-5 h-5" />, link: '/Products_Form' },
    { name: "Security", icon: <Shield className="w-5 h-5" />, link: '/dashboard'},
    { name: "Blockchain", icon: <LinkIcon className="w-5 h-5" />, link: '/dashboard' },
    { name: "Manufacturing", icon: <Factory className="w-5 h-5" />, link: '/Inventory' },
    { name: "Scans", icon: <ScanLine className="w-5 h-5" />, link: '/Scan_Overview'},
    { name: "Users", icon: <Users className="w-5 h-5" />, link: '/users' },
    { name: "Settings", icon: <Settings className="w-5 h-5" />, link: '/settings' }
  ];

  return (
    <aside className="w-64 bg-blue-900/30 backdrop-blur-lg p-6 fixed h-full border-r border-blue-400/20">
      <h2 className="text-2xl font-bold text-blue-400">Industry 4.0</h2>
      
      {/* Improved Blockchain Toggle Switch */}
      <div className="mt-8 p-4 bg-blue-800/30 rounded-lg backdrop-blur border border-blue-500/30">
        <div className="flex flex-col space-y-3">
          <div>
            <h3 className="font-semibold text-blue-300 text-sm">Blockchain Integration</h3>
            <p className="text-xs text-blue-400/80 mt-1">
              Enable to use blockchain for secure QR codes
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-blue-300">
              {useBlockchain ? "Enabled" : "Disabled"}
            </span>
            
            <button 
              onClick={handleBlockchainToggle}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                useBlockchain ? 'bg-blue-500' : 'bg-gray-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-pressed={useBlockchain}
              aria-label="Toggle Blockchain"
            >
              <span className="sr-only">Toggle Blockchain</span>
              <span 
                className={`${
                  useBlockchain ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out`} 
              />
              {isLoading ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-4 w-4 rounded-full border-2 border-blue-200 border-t-transparent animate-spin"></span>
                </span>
              ) : useBlockchain ? (
                <Check className="absolute left-1 h-3 w-3 text-blue-200" />
              ) : (
                <X className="absolute right-1 h-3 w-3 text-blue-200" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 space-y-2">
        {services.map((item, index) => (
          <Link 
            key={index} 
            href={item.link}
            className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-blue-500/20 rounded-lg transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}