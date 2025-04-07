'use client'
import React from "react";
import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../hooks/useToast';
import * as z from 'zod';
import AssignTaskModal from '../../components/AssignTask'

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
import SalesChart from "../../components/SalesChart";
import { LucideTableCellsSplit, MoonIcon } from "lucide-react";

import DashboardCards from "../../components/DashboardCards";
import ProductPieChart from "../../components/ProductPieChart";
import SideBarComponent from "../../components/SideBarComponent";

const series = [
    { name: "year 1", data: [1000, 2400, 1350, 1050, 1849, 1900] },
    { name: "year 2", data: [1200, 1789, 1400, 1378, 2070, 1789] }
];

const options = {
    chart: { toolbar: { show: false } },
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#fff' } }
    },
    yaxis: { labels: { style: { colors: '#fff' } } },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false }
};

const productData = [20, 35, 25, 15, 30];
const labelList = ['Slice', 'Parle-G', 'MarieGold', 'Sprite', 'Oreo']
const pieOptions = {
    chart: {
        type: 'pie',
    },
    labels: labelList,
    colors: ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#775DD0'],
    legend: {
        position: 'bottom',
        labels: {
            colors: '#ffffff'
        }
    },
    tooltip: {
        style: {
            fontSize: '12px',
            color: '#000'
        }
    }
};

const topProducts = [...[
    { name: "Parle-G", amount: 1287 },
    { name: "Sprite", amount: 4000 },
    { name: "Slice", amount: 3900 }
]].sort((a, b) => b.amount - a.amount);

// Create a simpler schema just for the line manager form
const LineManagerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  location:z.string()
});

const Dashboard = () => {
  const {data:session,status}=useSession();
  const manufacturer=session?.user;
  const [showModal, setShowModal] = useState(false);
  const [lineManagers, setLineManagers] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempPassword,setTempPassword]=useState(null);
  const [showAssignModal,setShowAssignModal]=useState(false);

  const form=useForm({
    resolver:zodResolver(LineManagerSchema),
    defaultValues:{
      name:'',
      email:'',
      location:'',
    }
});
 
const {toast} = useToast();
// Fetch line managers on component mount
useEffect(() => {
  if(status==="authenticated"){
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
  }
  
}, [status]); // Empty dependency array means this runs once on component mount
if(status==="loading"){
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
    <span className="ml-2">Loading...</span>
  </div>
  )
}
if (!session) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Please log in to access the dashboard.</h1>
    </div>
  );
}
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
   
          <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <SideBarComponent />
      
            {/* Main Content */}
            <main className="ml-64 p-10 flex-1">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                  <MoonIcon className="text-white cursor-pointer" size={24} />
                </div>
      
                {/* Dashboard Cards */}
                <div className="w-full my-4">
                  <DashboardCards />
                </div>
      
                {/* Sales and Product Charts */}
                <div className="grid grid-cols-3 gap-4">
                  <SalesChart 
                    className="col-span-2 row-span-4 border-none shadow" 
                    series={series} 
                    options={options} 
                    type={'area'} 
                    title={"Products Manufactured"} 
                  />
                  <ProductPieChart 
                    className="col-span-1 row-span-4 border-none shadow" 
                    series={productData} 
                    options={pieOptions} 
                    type={'pie'} 
                  />
                </div>
      
                {/* Line Managers Section */}
                <div className="mt-8">
                  <h1 className="text-3xl font-bold">Line Managers</h1>
                  <button 
                     onClick={() => setShowAssignModal(true)} 
                    className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Assign task to Line Manager</span>
                  </button>
                  <button 
                    onClick={() => setShowModal(true)} 
                    className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Line Manager</span>
                  </button>
                  {/* Assign Task Modal */}
                  <AssignTaskModal isOpen={showAssignModal} onClose={()=>setShowAssignModal(false)} />

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
                          <p className="text-sm text-gray-300">{manager.location}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-400">
                        No line managers found. Add your first one!
                      </div>
                    )}
                  </div>
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
                                      className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 transition-all duration-300 placeholder-gray-500" 
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
                                      className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 transition-all duration-300 placeholder-gray-500" 
                                    />
                                  </FormControl>
                                  <FormMessage className="text-blue-500" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700 flex items-center">
                                    <Building2 className="mr-2 text-blue-500" size={20} />
                                    Location
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter line manager's Location" 
                                      {...field}
                                      className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 transition-all duration-300 placeholder-gray-500" 
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
              </div>
            </main>
          </div>
        
      
  )
}

export default Dashboard;