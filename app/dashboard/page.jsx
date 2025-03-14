// import React from "react";
// import { QrCode, Shield, Link, Factory, BarChart2, Users, Settings } from "lucide-react";

// const Dashboard = () => {
//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-blue-900/30 backdrop-blur-lg p-6 fixed h-full border-r border-blue-400/20">
//         <h2 className="text-2xl font-bold text-blue-400">Industry 4.0</h2>
//         <nav className="mt-8 space-y-4">
//           {[
//             { name: "Overview", icon: <BarChart2 className="w-5 h-5" /> },
//             { name: "QR Management", icon: <QrCode className="w-5 h-5" /> },
//             { name: "Security", icon: <Shield className="w-5 h-5" /> },
//             { name: "Blockchain", icon: <Link className="w-5 h-5" /> },
//             { name: "Manufacturing", icon: <Factory className="w-5 h-5" /> },
//             { name: "Users", icon: <Users className="w-5 h-5" /> },
//             { name: "Settings", icon: <Settings className="w-5 h-5" /> }
//           ].map((item, index) => (
//             <button key={index} className="flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-blue-500/20 rounded-lg transition">
//               {item.icon}
//               <span>{item.name}</span>
//             </button>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-64 p-10">
//         <h1 className="text-3xl font-bold">Dashboard Overview</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
//           {[{
//             label: "Active QR Codes",
//             value: "12,530",
//             icon: <QrCode className="w-10 h-10 text-blue-400" />
//           }, {
//             label: "Security Breaches",
//             value: "3",
//             icon: <Shield className="w-10 h-10 text-red-400" />
//           }, {
//             label: "Blockchain Transactions",
//             value: "124K",
//             icon: <Link className="w-10 h-10 text-green-400" />
//           }, {
//             label: "Manufacturers",
//             value: "500+",
//             icon: <Factory className="w-10 h-10 text-yellow-400" />
//           }].map((stat, index) => (
//             <div key={index} className="bg-blue-900/30 p-6 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all">
//               <div className="flex items-center space-x-4">
//                 {stat.icon}
//                 <div>
//                   <p className="text-xl font-bold">{stat.value}</p>
//                   <p className="text-sm text-gray-300">{stat.label}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
'use client'
import React from "react";
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../hooks/useToast';
import * as z from 'zod';
//import {ManufacturerClientSchema} from '../../Schema/manufacturerClientShema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../components/ui/form";

import { Input } from "../../components/ui/input";  // Ensure Input component exists
import { Button } from "../../components/ui/button";
import { QrCode, Shield, Link, Factory, BarChart2, Users, Settings,Plus,Building2,Loader2 } from "lucide-react";
// Create a simpler schema just for the line manager form
const LineManagerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" })
});

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [lineManagers, setLineManagers] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword,setTempPassword]=useState(null);
  const form=useForm({
    resolver:zodResolver(LineManagerSchema),
    defaultValues:{
      name:'',
      email:''
    }
});
  // const addLineManager = () => {
  //   if (managerName && managerEmail) {
  //     setLineManagers([...lineManagers, { name: managerName, email: managerEmail }]);
  //     setManagerName("");
  //     setManagerEmail("");
  //     setShowModal(false);
  //   }
  // };
const {toast} = useToast();
// Fetch line managers on component mount
useEffect(() => {
  const fetchLineManagers = async () => {
    try {
      const response = await axios.get('/api/lineManagers/fetch-line-managers');
      if (response.data.success) {
        setLineManagers(response.data.lineManagers);
      } else {
        toast({
          title: "Failed to load line managers",
          description: response.data.message || "An error occurred",
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to load line managers",
        description: error.response?.data?.message || "An error occurred while fetching line managers",
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchLineManagers();
}, []); // Empty dependency array means this runs once on component mount

const onSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    const response = await axios.post('/api/lineManagers/add-line-manager', data, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.success) {
      setLineManagers([...lineManagers, response.data.lineManager]);
      setTempPassword(response.data.tempPassword);
      
      toast({
        title: 'Line manager added',
        description: 'An email with credentials has been sent',
        duration: 5000,
      });
    } else {
      throw new Error(response.data.message || "Failed to add line manager");
    }
   
  } catch (error) {
    toast({
      title: "Line Manager could not be added",
      description: error.response?.data?.message || "An error occurred",
      variant: 'destructive',
      duration: 5000,
    });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900/30 backdrop-blur-lg p-6 fixed h-full border-r border-blue-400/20">
        <h2 className="text-2xl font-bold text-blue-400">Industry 4.0</h2>
        <nav className="mt-8 space-y-4">
          {[{ name: "Overview", icon: <BarChart2 className="w-5 h-5" /> },
            { name: "QR Management", icon: <QrCode className="w-5 h-5" /> },
            { name: "Security", icon: <Shield className="w-5 h-5" /> },
            { name: "Blockchain", icon: <Link className="w-5 h-5" /> },
            { name: "Manufacturing", icon: <Factory className="w-5 h-5" /> },
            { name: "Users", icon: <Users className="w-5 h-5" /> },
            { name: "Settings", icon: <Settings className="w-5 h-5" /> }].map((item, index) => (
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
        <button onClick={() => setShowModal(true)} className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Line Manager</span>
        </button>

        {/* List of Line Managers */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2">Loading line managers...</span>
            </div>
          ) : lineManagers.length > 0 ? (
            lineManagers.map((manager, index) => (
              <div key={index} className="bg-blue-900/30 p-4 rounded-lg border border-blue-400/20">
                <p className="text-lg font-bold">{manager.name}</p>
                <p className="text-sm text-gray-300">{manager.email}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              No line managers found. Add your first one!
            </div>
          )}
        </div>
        {/* Modal Popup */}
        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Add Line Manager</h2>
          {tempPassword ? (
                <div className="text-center">
                  <p className="text-gray-800 font-semibold">Line Manager added successfully!</p>
                  <p className="mt-2 text-gray-700">Temporary Password:</p>
                  <div className="mt-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-md text-lg font-bold">
                    {tempPassword}
                  </div>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="mt-4 w-full text-center text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              ) : (
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
             control={form.control}
             name="name"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-gray-700 flex items-center">
                   <Building2 className="mr-2 text-blue-500" size={20} />
                   Name 
                 </FormLabel>
                 <FormControl>
                   <Input 
                     placeholder="Enter Line Manager name" 
                     {...field}
                     className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 
                                transition-all duration-300 placeholder-gray-500" 
                   />
                 </FormControl>
                 <FormMessage className="text-blue-500" />
               </FormItem>
             )}
           />
            <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel className="text-gray-700 flex items-center">
                   <Building2 className="mr-2 text-blue-500" size={20} />
                   Email
                 </FormLabel>
                 <FormControl>
                   <Input 
                     placeholder="Enter line manager's email" 
                     {...field}
                     className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 
                                transition-all duration-300 placeholder-gray-500" 
                   />
                 </FormControl>
                 <FormMessage className="text-blue-500" />
               </FormItem>
             )}
           />
           <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Adding...
                </>
              ) : (
                'Add'
              )}
            </Button>
            {/* cancel the button */}
            <button 
                onClick={() => setShowModal(false)} 
                className="mt-4 w-full text-center text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </form>
            </Form>
              )}
            
           </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;