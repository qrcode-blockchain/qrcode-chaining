"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../Schema/productSchema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from "./ui/form";
import { Calendar1Icon } from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/useToast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog"
  
const emptyValues = {
    name: "",
    batchNo: "",
    startSerialNo: 1,
    endSerialNo:'',
    price: '',
    date: "",
    NoOfUnits: '',
    location: ""
};

export default function ProductForm({ onSave, selectedProduct, onCancel, onDelete ,taskId,role,remainingUnits,setRemainingUnits,lastUsedSerialNo,setLastUsedSerialNo}) {
    const {toast}=useToast();
    const methods = useForm({
        resolver: zodResolver(productSchema), 
        // defaultValues: {
        //     selectedProduct || emptyValues,

        // }
        defaultValues: {
            ...(selectedProduct || emptyValues),
            startSerialNo:selectedProduct?.startSerialNo || lastUsedSerialNo || 1
        }
    });
    const [taskData,setTaskData]=useState(null);
    //const [remainingAmount,setRemainingAmount]=useState(0);
    const { reset, handleSubmit,setValue,watch } = methods;
    const [loading,setLoading]=useState(false);
    const [showCompleteModal,setShowCompleteModal]=useState(false);
    const [isTaskCompleted, setIsTaskCompleted] = useState(remainingUnits <= 0);
    const watchedNoOfUnits=watch("NoOfUnits");
    //for manufacturer 
useEffect(()=>{
    if(role==='manufacturer' && !remainingUnits&& watchedNoOfUnits){
        
            setRemainingUnits(parseInt(watchedNoOfUnits));
        
    }
},[]);
    useEffect(() => {
        if (selectedProduct) {
            reset(selectedProduct);
        }
    }, [selectedProduct, reset]);

useEffect(()=>{
    if(!selectedProduct){
        setValue("startSerialNo",lastUsedSerialNo);
    }
    
},[lastUsedSerialNo,selectedProduct,setValue]);
useEffect(() => {
    if (role === 'manufacturer' && watchedNoOfUnits) {
        // Only update if this is a new product or if the NoOfUnits has changed
        if (!selectedProduct || selectedProduct.NoOfUnits !== watchedNoOfUnits) {
            setRemainingUnits(parseInt(watchedNoOfUnits));
        }
    }
}, [role, watchedNoOfUnits, selectedProduct, setRemainingUnits]);

// Define the function outside of useEffect for better reusability
const getLastUsedSerialNoFromLocalStorage = () => {
    try {
      // Get products from localStorage
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      console.log("The stred roucts in cnsole is",storedProducts);
      
      if (storedProducts.length === 0) {
        return 1; // Default to 1 if no products exist
      }
      
      // Find the highest endSerialNo in the stored products
      // Use a safer approach that handles undefined or non-numeric values
      const highestEndSerialNo = storedProducts.reduce((highest, product) => {
        // Only consider products with valid endSerialNo values
        if (product.endSerialNo !== undefined && product.endSerialNo !== null && product.endSerialNo !== '') {
          const endSerialNum = parseInt(product.endSerialNo);
          if (!isNaN(endSerialNum)) {
            return Math.max(highest, endSerialNum);
          }
        }
        return highest;
      }, 0);
      
      console.log("Highest end serial number found:", highestEndSerialNo);
      
      // The next serial number should be one more than the highest end serial
      return highestEndSerialNo + 1;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return 1; // Default to 1 in case of error
    }
  };
//   useEffect(() => {
//     if (role === 'lineManager') {
//       // Only update lastUsedSerialNo if it's not already set
//       if (!lastUsedSerialNo || lastUsedSerialNo === 1) {
//         const nextSerialNo = getLastUsedSerialNoFromLocalStorage();
//         console.log("Setting last used serial number to:", nextSerialNo);
//         setLastUsedSerialNo(nextSerialNo);
//       }
//     }
//   }, [role, lastUsedSerialNo, setLastUsedSerialNo]);
// useEffect(()=>{
//     if(role==='lineManager'){
     
//           const highestEndSerial=getLastUsedSerialNoFromLocalStorage();
//           console.log("The highest end serial no is",highestEndSerial);
          
//         const isComplete = 
//         remainingUnits <= 0 || 
//         (taskData?.NoOfUnits && highestEndSerial >= taskData.NoOfUnits);
//         setIsTaskCompleted(isComplete);
//     } else{
//         setIsTaskCompleted(false); 
//     }
   
// },[remainingUnits,role,taskData,highestEndSerial]);

useEffect(() => {
    if (role === 'lineManager') {
      // Calculate if task is complete
      let isComplete = false;
      const highestEndSerial=getLastUsedSerialNoFromLocalStorage();
      console.log("The last used serial no in useEffect is",highestEndSerial);
      
      if (remainingUnits <= 0 && highestEndSerial || highestEndSerial>=taskData?.NoOfUnits) {
        isComplete = true;
      }
      
      console.log("Task completion check:", {
        remainingUnits,
        lastUsedSerialNo,
        totalUnits: taskData?.NoOfUnits,
        isComplete
      });
      
      setIsTaskCompleted(isComplete);
    } else {
      setIsTaskCompleted(false); 
    }
  }, [remainingUnits, role, taskData]);

useEffect(()=>{
    const fetchTaskData = async () => {
        if (role === "lineManager" && taskId) {
            setLoading(true);
            try {
                const response = await axios.get('/api/lineManagers/fetch-assigned-task');
                const highestEndSerial=getLastUsedSerialNoFromLocalStorage();
                if (response.data.success) {
                    // Find the specific task with matching taskId
                    const task = response.data.tasks.find(t => t._id === taskId);
                    console.log("The task data is",task);
                    
                    if (task) {
                        setTaskData(task);
                        
                        // Pre-populate form with task data
                        if (task.productName) setValue("name", task.productName);
                        if (task.productPrice) setValue("price", task.productPrice);
                        if (task.NoOfUnits) setValue("NoOfUnits", task.NoOfUnits);
                        if(task.location) setValue("location",task.location);
                        // if(remainingUnits === 0 || remainingUnits === undefined ){
                        //     setRemainingUnits(task.NoOfUnits)
                        // }else if(remainingUnits===task.NoOfUnits || lastUsedSerialNo && task.NoOfUnits && highestEndSerial>=task.NoOfUnits){
                        //     setIsTaskCompleted(true);
                        //     setRemainingUnits(0);
                        // }
                       if(remainingUnits===0 && highestEndSerial>=task.NoOfUnits){
                        setRemainingUnits(0);
                        setIsTaskCompleted(true);
                       }else if(remainingUnits===0 || remainingUnits===undefined){
                            setRemainingUnits(task.NoOfUnits)
                       }
                      console.log("The remaining units is",remainingUnits);
                     
                      console.log("Last used serial no:", lastUsedSerialNo);
                      console.log("Total units:", task.NoOfUnits);
                      console.log("Task completed state:", remainingUnits === 0 || 
                          (lastUsedSerialNo && task.NoOfUnits && lastUsedSerialNo >= task.NoOfUnits));
                    } else {
                        toast({
                            title: "Task not found",
                            description: "Could not find the specified task",
                            variant: 'destructive',
                            duration: 5000,
                        });
                    }
                } else {
                    toast({
                        title: "Failed to fetch tasks",
                        description: response.data.message || "An error occurred",
                        variant: 'destructive',
                        duration: 5000,
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                toast({
                    title: "Failed to find tasks",
                    description: error.response?.data?.message || "An error occurred while fetching line tasks",
                    variant: 'destructive',
                    duration: 5000,
                });
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };
    
    fetchTaskData();
},[taskId,role,setValue,toast])

const handleEndSerialChange = (e) => {
    const endSerialNo = Number(e.target.value);
    const startSerialNo = Number(watch("startSerialNo"));
    
    // Get adjusted remaining units if this is an update
    let adjustedRemainingUnits = remainingUnits;
    
    if (selectedProduct) {
        // Add back the units from the existing product
        const existingUnitsUsed = selectedProduct.endSerialNo - selectedProduct.startSerialNo + 1;
        adjustedRemainingUnits += existingUnitsUsed;
    }
    
    if (endSerialNo >= startSerialNo && (endSerialNo - startSerialNo + 1) <= adjustedRemainingUnits) {
        setValue("endSerialNo", endSerialNo);
    } else if (endSerialNo < startSerialNo) {
        toast({
            title: "Invalid Serial Number",
            description: "End serial number must be greater than or equal to start serial number",
            variant: 'destructive'
        });
    } else {
        toast({
            title: "Invalid Serial Number",
            description: `You only have ${adjustedRemainingUnits} units available`,
            variant: 'destructive'
        });
    }
};

const getPreservedValues = () => {
    const preservedValues = { ...emptyValues };
    
    if (role === "lineManager" && taskId && taskData) {
        if ('productName' in taskData) preservedValues.name = taskData.productName;
        if ('productPrice' in taskData) preservedValues.price = taskData.productPrice;
        if ('NoOfUnits' in taskData) preservedValues.NoOfUnits = taskData.NoOfUnits;
        if ('location' in taskData) preservedValues.location = taskData.location;
    }
    preservedValues.startSerialNo=lastUsedSerialNo;
    return preservedValues;
};

    const handleSubmitForm = (data) => { 
        onSave(data);
        // const newRemainingAmount=remainingAmount-(data.endSeralNo-data.startSerialNo+1);
        // setRemainingAmount(newRemainingAmount);
        console.log("The data in form is",data);
        
        const newUnitsUsed=remainingUnits-(data.endSerialNo-data.startSerialNo+1);
        setRemainingUnits(newUnitsUsed);
        const taskCompleted=newUnitsUsed<=0;
        setIsTaskCompleted(taskCompleted);

        if(!taskCompleted){
            const newLastUsedSerialNo=data.endSerialNo+1;
            setLastUsedSerialNo(newLastUsedSerialNo);
            console.log("he last used seral no in form is",newLastUsedSerialNo);
        }
       
      
        if (role === 'lineManager' && (data.endSerialNo === Number(taskData?.NoOfUnits) || taskCompleted)) {
            setShowCompleteModal(true);
        }
        if(!taskCompleted){
        const resetValues=getPreservedValues();
        resetValues.startSerialNo=data.endSerialNo+1;
        resetValues.endSerialNo='';
        reset(resetValues);
        }
        // }else{
        //     reset({
        //         ...data,
        //         endSerialNo:data.endSerialNo
        //     })
        // }
        
    };

    const handleCancelEvent = () => {
        onCancel();
        methods.reset(getPreservedValues());
    };

    const handleDeleteEvent = () => {
        if (!selectedProduct) return;
        onDelete(selectedProduct);
       reset(getPreservedValues);
    };
        //to determivne if a feld is ready only
        const isFieldReadOnly = (fieldName) => {
            if(role==='lineManager' && isTaskCompleted) return true;
            if(role==='manufacturer'){
                return false;
            }
            if (role !== "lineManager" || !taskId || !taskData) return false;
            
            // Map task fields to form fields
            const readOnlyFieldMap = {
                "name": "productName" in taskData,
                "price": "productPrice" in taskData,
                "NoOfUnits": "NoOfUnits" in taskData,
                "location":"location" in taskData,
            };
            
            return readOnlyFieldMap[fieldName] || false;
        };
        if (loading) {
            return <div className="p-4 text-center">Loading form data...</div>;
        }
    return (
        <div className="bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
             {isTaskCompleted && (
                <div className="bg-green-500/20 border border-green-500 text-green-100 p-4 mb-4 rounded-lg">
                    <p className="font-semibold">Task Completed ✓</p>
                    <p>All units have been processed. Form is now disabled.</p>
                </div>
            )}
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-2 gap-2">
                    {/* Product Name */}
                    <FormField control={methods.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Product Name" {...field}
                                readOnly={isFieldReadOnly("name")}
                                className={isFieldReadOnly("name") ? "bg-gray-500 cursor-not-allowed" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Batch No */}
                    <FormField control={methods.control} name="batchNo" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Batch No</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Batch No." {...field} 
                                 readOnly={isFieldReadOnly("batchNo")}
                                 className={isFieldReadOnly("batchNo") ? "bg-gray-500 cursor-not-allowed" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
  {/* Date */}
  <FormField control={methods.control} name="date" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Calendar1Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <Input
                                        type="date" 
                                        className="pl-10"
                                        {...field}
                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                        onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                                        readOnly={isTaskCompleted}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Amount */}
                    <FormField control={methods.control} name="NoOfUnits" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Units</FormLabel>
                            <FormControl>
                            <Input 
                                    type="number" 
                                    placeholder="Enter Total Number of Units" 
                                    {...field} 
                                    readOnly={isFieldReadOnly("NoOfUnits")}
                                    className={isFieldReadOnly("NoOfUnits") ? "bg-gray-500 cursor-not-allowed" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {/* Serial No */}
                    <FormField control={methods.control} name="startSerialNo" render={({ field }) => (
                        <FormItem>
                            <FormLabel> Start Serial No</FormLabel>
                            <FormControl>
                                {/* <Input type="number" readOnly className="cursor-not-allowed" {...field} /> */}
                                <Input type="number" readOnly={role==='lineManager'}
                                 className={role==="lineManager" ?"cursor-not-allowed" : ''} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={methods.control} name="endSerialNo" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Serial No</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onBlur={handleEndSerialChange} placeholder="End Serial Number"
                                                     readOnly={role === 'lineManager' && isTaskCompleted}
                                                     className={role === 'lineManager' && isTaskCompleted ? "bg-gray-500 cursor-not-allowed" : ""}
                                                    />
                                                </FormControl>
                                            </FormItem>
                       )} />

                    {/* Price */}
                    <FormField control={methods.control} name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                            <Input 
                                    type="number" 
                                    placeholder="Enter Price" 
                                    {...field} 
                                    readOnly={isFieldReadOnly("price")}
                                    className={isFieldReadOnly("price") ? "bg-gray-500 cursor-not-allowed" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                  

                    {/* Location */}
                    <FormField control={methods.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                            <Input 
                                    type="string" 
                                    placeholder="Enter Location" 
                                    {...field} 
                                    readOnly={isFieldReadOnly("location")}
                                    className={isFieldReadOnly("location") ? "bg-gray-500 cursor-not-allowed" : ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 col-span-2 gap-1">
                        {/* Save Button */}
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-400"
                        disabled={isTaskCompleted}
                        >
                            Create QRCodes
                        </Button>

                        {/* Cancel Button */}
                        <Button type="button" variant="outline" className="border-blue-600 text-blue-600" onClick={handleCancelEvent}
                         
                        >
                            Cancel
                        </Button>

                        {/* Delete Button */}
                        <Button type="button" variant="destructive" onClick={handleDeleteEvent}
                        
                        >
                            Delete
                        </Button>
                    </div>
                </form>
            </FormProvider>

            <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Task Completed 🎉</DialogTitle>
                        <DialogDescription>
                            You have completed the required units for this task.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setShowCompleteModal(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}





