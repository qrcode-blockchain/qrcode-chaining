
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";

import { 
  Loader2, 
  UserCheck, 
  MapPin, 
  Package, 
  DollarSign, 
  Hash, 
  X, 
  CheckCircle2,
  AlertCircle,
  Barcode,
  Tag
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '../hooks/useToast';
import { useSession } from "next-auth/react";

// Schema validation
const AssignTaskSchema = z.object({
  lineManager: z.string().min(1, { message: "Line manager needs to be selected" }),
  location: z.string().min(1, { message: "Location is required" }),
  productName: z.string().min(1, { message: "Product name is required" }),
  productPrice: z.coerce.number().positive({ message: "Product price must be a positive number" }),
  TotalNoOfUnits: z.coerce.number().int().positive({ message: "Number of units must be a positive integer" })
});


const AssignTaskModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lineManagers, setLineManagers] = useState([]);
  const [useBlockchain,setUseBlockchain]=useState(false);
   const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();
  const handleBlockchainToggle = async () => {
    setIsLoading(true);
    try {
      const newValue = !useBlockchain;
      console.log("The new value is", newValue);
      
      // // Update preference in the database
      // const response = await fetch('/api/manufacturers/preferences', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ useBlockchain: newValue }),
      // });
      
      // const data = await response.json();
      // console.log("The data in toggle is", data);
      
      
        setUseBlockchain(newValue);
     
    } catch (error) {
      console.error("Error updating blockchain preference:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const form = useForm({
    resolver: zodResolver(AssignTaskSchema),
    defaultValues: {
      lineManager: '',
      location: '',
      productName: '',
      productPrice: '',
      TotalNoOfUnits: '',
    }
  });
 const manufacturerId=session?.user._id;
  // To fetch line managers 
  useEffect(() => {
    if (isOpen && session?.user.email) {
      axios.get(`api/lineManagers/fetch-line-managers`)
        .then(response => {
          if (response.data.success) {
            setLineManagers(response.data.lineManagers);
          }
        })
        .catch(error => console.error("Error fetching line managers", error));
    }
  }, [isOpen, session]);

  // Fetch location of line manager now
  const selectedLineManager = form.watch('lineManager'); //this contains the id
  
  useEffect(() => {
    if (selectedLineManager) {
      const manager = lineManagers.find(m => m._id === selectedLineManager);
      setLocation(manager ? manager.location : "");
      form.setValue("location", manager ? manager.location : "");
    } else {
      setLocation("");
      form.setValue("location", "");
    }
  }, [selectedLineManager, lineManagers, form]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/lineManagers/assign-task',{...data,manufacturerId,useBlockchain} , {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data.success) {
        toast({
          title: "Task Assigned Successfully",
          description: "The task has been assigned to the line manager.",
          duration: 5000,
        });
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Error Assigning Task",
        description: error.response?.data?.message || "An error occurred while assigning the task.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  
 

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm transition-opacity duration-300"
      
    >
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-3xl shadow-2xl transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <CheckCircle2 className="mr-2 text-blue-600" size={20} />
            Assign New Task
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col space-y-3">
            <div>
              <h3 className="text-gray-700 flex items-center font-medium text-sm">
                {/* <Shield className="mr-1 text-blue-600" size={16} /> */}
                Blockchain Integration
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Enable to use blockchain for secure QR codes
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-gray-700">
                {useBlockchain ? "Enabled" : "Disabled"}
              </span>
              
              <button 
                onClick={handleBlockchainToggle}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                  useBlockchain ? 'bg-blue-600' : 'bg-gray-300'
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
                    <span className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-transparent animate-spin"></span>
                  </span>
                ) : useBlockchain ? (
                  <Check className="absolute left-1 h-3 w-3 text-white" />
                ) : (
                  <X className="absolute right-1 h-3 w-3 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="lineManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center font-medium text-sm">
                        <UserCheck className="mr-1 text-blue-600" size={16} />
                        Line Manager
                      </FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="border border-gray-300 p-2 rounded-lg w-full bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all duration-200 text-sm"
                        >
                          <option value="">Select Line Manager</option>
                          {lineManagers.map(manager => (
                            <option key={manager._id} value={manager._id}>
                              {manager.name} ({manager.email})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center font-medium text-sm">
                        <MapPin className="mr-1 text-blue-600" size={16} />
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={location || ""} 
                          readOnly 
                          className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full shadow-sm text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center font-medium text-sm">
                        <Package className="mr-1 text-blue-600" size={16} />
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product name" 
                          {...field} 
                          className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all duration-200 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Right Column */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center font-medium text-sm">
                        <DollarSign className="mr-1 text-blue-600" size={16} />
                        Product Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                           
                          </div>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            className="pl-6 border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all duration-200 text-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="TotalNoOfUnits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 flex items-center font-medium text-sm">
                        <Hash className="mr-1 text-blue-600" size={16} />
                        Number of Units
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter quantity" 
                          {...field} 
                          className="border border-gray-300 p-2 rounded-lg w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all duration-200 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center mt-1 mb-1">
                  <AlertCircle className="text-amber-500 mr-1" size={16} />
                  <p className="text-xs text-amber-700 font-medium">Fields below will be filled by line manager</p>
                </div>
              </div>
            </div>
            
            {/* Line Manager Fields - Disabled (Full Width) */}
            <div className="mt-3 grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="space-y-1">
                <label className="text-gray-700 flex items-center font-medium text-xs">
                  <Barcode className="mr-1 text-gray-500" size={16} />
                  Batch ID
                </label>
                <div className="relative">
                  <Input 
                    disabled
                    placeholder="To be filled by line manager"
                    className="bg-gray-100 border border-gray-300 p-2 rounded-lg w-full shadow-sm text-gray-500 text-xs"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-gray-200 px-1 py-0.5 rounded text-xs">Line manager</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 flex items-center font-medium text-xs">
                  <Tag className="mr-1 text-gray-500" size={16} />
                  Serial Number
                </label>
                <div className="relative">
                  <Input 
                    disabled
                    placeholder="To be filled by line manager"
                    className="bg-gray-100 border border-gray-300 p-2 rounded-lg w-full shadow-sm text-gray-500 text-xs"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500 bg-gray-200 px-1 py-0.5 rounded text-xs">Line manager</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-4">
              <Button 
                type="button" 
                onClick={onClose} 
                className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                ) : (
                  <CheckCircle2 className="mr-1" size={16} />
                )}
                {isSubmitting ? "Assigning..." : "Assign Task"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
