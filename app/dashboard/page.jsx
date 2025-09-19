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
import EnhancedProductPieChart from '../../components/EnhancedProductPieChart';
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
import { TrendingUp } from 'lucide-react';
import DashboardCards from "../../components/DashboardCards";
import ProductPieChart from "../../components/ProductPieChart";
import SideBarComponent from "../../components/SideBarComponent";


const ImprovedSalesChart = ({ series, options, className, title }) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  
  const enhancedOptions = {
    ...options,
    chart: {
      ...options.chart,
      events: {
        dataPointSelection: function(event, chartContext, config) {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex = config.dataPointIndex;
          const seriesData = chartContext.w.config.series[seriesIndex];
          const productName = seriesData.name;
          const monthValue = seriesData.data[dataPointIndex];
          const monthName = options.xaxis.categories[dataPointIndex];
          
          setSelectedDataPoint({
            product: productName,
            month: monthName,
            units: monthValue,
            totalUnits: seriesData.totalUnits || 0
          });
        }
      }
    },
    tooltip: {
      ...options.tooltip,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const productName = w.config.series[seriesIndex].name;
        const value = series[seriesIndex][dataPointIndex];
        const month = w.config.xaxis.categories[dataPointIndex];
        
        return `
          <div class="bg-gray-800 p-3 rounded-lg border border-gray-600">
            <div class="text-white font-semibold">${productName}</div>
            <div class="text-gray-300 text-sm">${month}: ${value.toLocaleString()} units</div>
          </div>
        `;
      }
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <TrendingUp className="mr-2 text-blue-400" />
          {title}
        </h2>
      </div>
      
      <div className="h-80">
        <SalesChart 
          series={series} 
          options={enhancedOptions} 
          type="area"
          height={320}
        />
      </div>

      {/* Legend with totals */}
      <div className="mt-6 flex flex-wrap gap-4">
        {series.map((seriesItem, index) => (
          <div key={index} className="flex items-center space-x-2">
            {/* <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: enhancedOptions.colors[index] }}
            /> */}
            {/* <span className="text-sm text-gray-300">{seriesItem.name}</span>
            <span className="text-xs text-gray-500">
              ({(seriesItem.totalUnits || seriesItem.data.reduce((a, b) => a + b, 0)).toLocaleString()} total)
            </span> */}
          </div>
        ))}
      </div>

      {/* Selected Data Point Info */}
      {selectedDataPoint && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <Package className="mr-2 text-blue-400" />
            Selected Data Point
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Product:</span>
              <span className="ml-2 text-white font-medium">{selectedDataPoint.product}</span>
            </div>
            <div>
              <span className="text-gray-400">Month:</span>
              <span className="ml-2 text-white font-medium">{selectedDataPoint.month}</span>
            </div>
            <div>
              <span className="text-gray-400">Units Produced:</span>
              <span className="ml-2 text-green-400 font-medium">{selectedDataPoint.units.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Units (Year):</span>
              <span className="ml-2 text-blue-400 font-medium">{selectedDataPoint.totalUnits.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const productData = [20, 35, 25, 15, 30];
const labelList = ['Slice', 'Parle-G', 'MarieGold', 'Sprite', 'Oreo'];
const pieOptions = {
  chart: {
    type: 'pie',
    background: 'transparent'
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
  const [chartSeries, setChartSeries] = useState([]);
  const [pie, setPie] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    chart: { 
      toolbar: { show: false },
      background: 'transparent',
      type: 'area'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { 
        style: { 
          colors: '#e2e8f0',
          fontSize: '12px'
        } 
      }
    },
    yaxis: { 
      labels: { 
        style: { 
          colors: '#e2e8f0',
          fontSize: '12px'
        },
        formatter: function(value) {
          return Math.round(value).toLocaleString();
        }
      }
    },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    legend: {
      labels: {
        colors: '#e2e8f0'
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
  });
  const [chartLoading, setChartLoading] = useState(true);


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
    
    const fetchChartData = async () => {
      try {
        const response = await axios.get('/api/manufacturers/getChartData');
        if (response.data.success) {
          setChartSeries(response.data.series);
          setPie(response.data.pie);
          setChartOptions(prevOptions => ({
            ...prevOptions,
            ...response.data.options
          }));
        } else {
          toast({
            title: "Failed to load chart data",
            description: response.data.message || "An error occurred",
            variant: 'destructive',
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        toast({
          title: "Failed to load chart data",
          description: error.response?.data?.message || "An error occurred while fetching chart data",
          variant: 'destructive',
          duration: 5000,
        });
      } finally {
        setChartLoading(false);
      }
    };

     
    fetchLineManagers();
    fetchChartData();
  }
  
}, [status]); // Empty dependency array means this runs once on component mount
if(status==="loading"){
  return (
    <div className="flex justify-center i tems-center min-h-screen bg-gray-900 text-white">
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
            {chartLoading ? (
              <div className="col-span-2 row-span-4 border-none shadow bg-gray-800 rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-2">Loading chart data...</span>
              </div>
            ) : (
              <ImprovedSalesChart 
              className="col-span-2 row-span-4 border-none shadow" 
              series={chartSeries} 
              options={chartOptions} 
              title="Products Manufactured" 
            />
            )}
            {pie && (
  // <ProductPieChart 
  //   className="col-span-1 row-span-4 border-none shadow"
  //   series={pie.series}
  //   options={{
  //     labels: pie.labels,
  //     dataLabels: {
  //       enabled: true,
  //       formatter: function (val) {
  //         return val.toFixed(1) + "%";
  //       }
  //     },
  //     legend: {
  //       labels: {
  //         colors: "#fff"
  //       }
  //     }
  //   }}
  //   type="pie"
  //   width="100%"
  // />
  <EnhancedProductPieChart 
    className="col-span-1 row-span-4 border-none shadow"
    series={pie.series}
    labels={pie.labels}
  />
)}
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