"use client";

import React from "react";
import Link from "next/link";
import { LinkIcon, Factory, Shield, BarChart2, QrCode, Users, Settings, ScanLine } from "lucide-react";

const services = [
    { name: "Overview", icon: <BarChart2 className="w-5 h-5" />, link: '/dashboard'},
    { name: "QR Management", icon: <QrCode className="w-5 h-5" />, link: '/Products_Form' },
    { name: "Security", icon: <Shield className="w-5 h-5" />, link: '/dashboard'},
    { name: "Blockchain", icon: <LinkIcon className="w-5 h-5" />, link: '/dashboard' },
    { name: "Manufacturing", icon: <Factory className="w-5 h-5" />, link: '/Inventory' },
    { name: "Scans", icon: <ScanLine className="w-5 h-5" />, link: '/Scan_Overview'},
    { name: "Users", icon: <Users className="w-5 h-5" />, link: '/users' },
    { name: "Settings", icon: <Settings className="w-5 h-5" />, link: '/settings' }
];

export default function SideBarComponent() {
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
