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
  // useEffect(() => {
  //   const fetchBlockchainPreference = async () => {
  //     setIsLoading(true);
  //     try {
  //       console.log("The api is being hit");
  //       const response = await fetch('/api/manufacturers/preferences');
  //       console.log('The response is', response);
          
  //       const data = await response.json();
  //       console.log("The data is", data);
        
  //       if (data.success) {
  //         setUseBlockchain(data.preferences.useBlockchain || false);
  //       } else {
  //         console.error("Failed to fetch blockchain preference:", data.message);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching blockchain preference:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
    
  //   fetchBlockchainPreference();
  // }, []);
  
  // console.log("The blockchain status is", useBlockchain);
  
  // // Handle toggle change
  // const handleBlockchainToggle = async () => {
  //   setIsLoading(true);
  //   try {
  //     const newValue = !useBlockchain;
  //     console.log("The new value is", newValue);
      
  //     // Update preference in the database
  //     const response = await fetch('/api/manufacturers/preferences', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ useBlockchain: newValue }),
  //     });
      
  //     const data = await response.json();
  //     console.log("The data in toggle is", data);
      
  //     if (data.success) {
  //       setUseBlockchain(newValue);
  //     } else {
  //       console.error("Failed to update blockchain preference:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating blockchain preference:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
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