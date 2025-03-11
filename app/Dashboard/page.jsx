import React from "react";
import { QrCode, Shield, Link, Factory, BarChart2, Users, Settings } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900/30 backdrop-blur-lg p-6 fixed h-full border-r border-blue-400/20">
        <h2 className="text-2xl font-bold text-blue-400">Industry 4.0</h2>
        <nav className="mt-8 space-y-4">
          {[
            { name: "Overview", icon: <BarChart2 className="w-5 h-5" /> },
            { name: "QR Management", icon: <QrCode className="w-5 h-5" /> },
            { name: "Security", icon: <Shield className="w-5 h-5" /> },
            { name: "Blockchain", icon: <Link className="w-5 h-5" /> },
            { name: "Manufacturing", icon: <Factory className="w-5 h-5" /> },
            { name: "Users", icon: <Users className="w-5 h-5" /> },
            { name: "Settings", icon: <Settings className="w-5 h-5" /> }
          ].map((item, index) => (
            <button key={index} className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-blue-500/20 rounded-lg transition">
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-10">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[{
            label: "Active QR Codes",
            value: "12,530",
            icon: <QrCode className="w-10 h-10 text-blue-400" />
          }, {
            label: "Security Breaches",
            value: "3",
            icon: <Shield className="w-10 h-10 text-red-400" />
          }, {
            label: "Blockchain Transactions",
            value: "124K",
            icon: <Link className="w-10 h-10 text-green-400" />
          }, {
            label: "Manufacturers",
            value: "500+",
            icon: <Factory className="w-10 h-10 text-yellow-400" />
          }].map((stat, index) => (
            <div key={index} className="bg-blue-900/30 p-6 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-4">
                {stat.icon}
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
