"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../Schema/productSchema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from "./ui/form";
import { Calendar, X, Package, AlertCircle, CheckCircle2, Clock, Lock, Edit3, Info } from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/useToast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

const emptyValues = {
    name: "",
    batchNo: "",
    startSerialNo: 1,
    endSerialNo: '',
    price: '',
    date:new Date().toISOString(),
    TotalNoOfUnits: '',
    location: "",
    remainingUnits:"",
};

export default function BatchDialog({ isOpen, onClose, taskId, role }) {
    const { toast } = useToast();
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [completedUnits,setCompletedUnits]=useState(0);
    const methods = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: emptyValues
    });

    const { reset, handleSubmit, setValue, watch } = methods;

    // Watch remaining units for dynamic updates
    const watchedRemainingUnits = watch("remainingUnits");
    const watchedTotalUnits = watch("TotalNoOfUnits");

    // Fetch task data when dialog opens
    useEffect(() => {
        const fetchTaskData = async () => {
           console.log(isOpen,taskId,role);
           
            if (role === "lineManager" || role==='manufacturer' && taskId && isOpen) {
               // console.log("The api is being hit before");
                setLoading(true);
                try {
                   // console.log("The api is being hit");
                    
                    const response = await axios.get('/api/lineManagers/fetch-assigned-task');
                    
                    if (response.data.success) {
                        const task = response.data.tasks.find(t => t._id === taskId);
                       // console.log("The task response is",task);
                        
                        if (task) {
                            setTaskData(task);
                            setCompletedUnits(task.completedUnits);
                            // Pre-populate form with task data
                            if (task.productName) setValue("name", task.productName);
                            if (task.productPrice) setValue("price", task.productPrice);
                            if (task.TotalNoOfUnits) setValue("TotalNoOfUnits", task.TotalNoOfUnits);
                            if (task.location) setValue("location", task.location);
                            const nextSerialNo = (task.startSerialNo || 1) + (task.completedUnits || 0);
                            setValue("startSerialNo", nextSerialNo);
                            if(task.TotalNoOfUnits && task.completedUnits !== undefined) {
                                const remaining = task.TotalNoOfUnits - task.completedUnits;
                                if(remaining > 0) setValue("remainingUnits", remaining);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error:", error);
                    toast({
                        title: "Failed to fetch task data",
                        description: error.response?.data?.message || "An error occurred while fetching task data",
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
    }, [taskId, role, setValue, toast, isOpen]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            reset(emptyValues);
            setTaskData(null);
        }
    }, [isOpen, reset]);

    const getPreservedValues = () => {
        const preservedValues = { ...emptyValues };
        
        if (role === "lineManager" && taskId && taskData) {
            if (taskData.productName) preservedValues.name = taskData.productName;
            if (taskData.productPrice) preservedValues.price = taskData.productPrice;
            if (taskData.TotalNoOfUnits) preservedValues.TotalNoOfUnits = taskData.TotalNoOfUnits;
            if (taskData.location) preservedValues.location = taskData.location;
            const nextSerialNo = (taskData.startSerialNo || 1) + completedUnits;
            preservedValues.startSerialNo = nextSerialNo;
            if(taskData.TotalNoOfUnits && completedUnits !== undefined) {
                const remaining = taskData.TotalNoOfUnits - completedUnits;
                if(remaining > 0) preservedValues.remainingUnits = remaining;
            }
        }
        
        return preservedValues;
    };

    const handleSubmitForm = async (data) => {
        
        try {
            console.log("Form submitted with data:", data);
            console.log("The taskid being sent is", taskId);

            const response = await axios.post('/api/batchCreation', {
                data,
                taskId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Response", response);
            //console.log("Response is",response.data.batch);
            const newEndSerialNo=response.data.batch.endSerialNo;
            const createdUnits=response.data.batch.createdUnits;
            setCompletedUnits(completedUnits);
            console.log("The status is",response.data.success);
            
            if (response.data.success) {
                const newCompletedUnits=completedUnits+ createdUnits;
                setCompletedUnits(newCompletedUnits);
                //create an api here to fetch task api
                toast({
                    title: "Success",
                    description: response.data.message || "QR Codes created successfully",
                    variant: 'default',
                    duration: 3000,
                });
                const nextSerailNo=newEndSerialNo +1;
                const remainingUnits=(taskData?.TotalNoOfUnits || 0)-newCompletedUnits;
                reset({
                    ...getPreservedValues,
                    startSerialNo: nextSerailNo,
                    remainingUnits:remainingUnits > 0?remainingUnits : 0,
                    batchNo:"",
                    endSerialNo:""
                });
                setValue("startSerialNo",nextSerailNo);
                setValue("remainingUnits",remainingUnits>0?remainingUnits:0);

               //call one more api to update the completedUnits value and next serial no
               const response1=await axios.post('/api/lineManagers/update-task',{newCompletedUnits,taskId}, {
                headers: {
                    'Content-Type': 'application/json'
                }
                
            });
            if(response1.data.success){
                console.log("The task in db has been successfully updated");
                
            }
            
            onClose();
            } else {
              
                toast({
                    title: "Error",
                    description: response.data.message ,
                    variant: 'destructive',
                    duration: 3000,
                })
            }
            
        } catch (error) {
            console.error("Error submitting form:", error);
            
            let errorMessage = "Failed to create QR codes";
            let errorTitle = "Error";
            
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            
            toast({
                title: errorTitle,
                description: errorMessage,
                variant: 'destructive',
                duration: 5000,
            });
        } finally {
            console.log("Finally");
            
        }
    };

    const handleCancelEvent = () => {
        reset(getPreservedValues());
        onClose();
    };

    const handleDeleteEvent = () => {
        // Add delete logic here
        console.log("Delete clicked");
    };

    // Determine if a field is read-only
    const isFieldReadOnly = (fieldName) => {
        if (role === 'manufacturer') {
            return false;
        }
        
        if (role !== "lineManager" || !taskId || !taskData) return false;
        
        // Map task fields to form fields for line manager
        const readOnlyFieldMap = {
            "name": !!taskData.productName,
            "price": !!taskData.productPrice,
            "TotalNoOfUnits": !!taskData.TotalNoOfUnits,
            "location": !!taskData.location,
            "remainingUnits": !!(taskData.TotalNoOfUnits && taskData.completedUnits !== undefined)
        };
        
        return readOnlyFieldMap[fieldName] || false;
    };

    const handleEndSerialChange = (e) => {
        // Add logic for end serial number change if needed
        console.log("End serial changed:", e.target.value);
    };

    // Calculate completion percentage
    const getCompletionPercentage = () => {
        if (!taskData || !taskData.TotalNoOfUnits) return 0;
        return Math.round((completedUnits / taskData.TotalNoOfUnits) * 100);
    };

    // Get status badge
    const getStatusInfo = () => {
        if (!taskData) return { status: "new", color: "bg-blue-100 text-blue-800", icon: Package };
        
        const remaining = taskData.TotalNoOfUnits - completedUnits;
        
        if (remaining === 0) {
            return { status: "completed", color: "bg-green-100 text-green-800", icon: CheckCircle2 };
        } else if (taskData.completedUnits > 0) {
            return { status: "in-progress", color: "bg-yellow-100 text-yellow-800", icon: Clock };
        } else {
            return { status: "pending", color: "bg-gray-100 text-gray-800", icon: AlertCircle };
        }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-3 border-b">
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-blue-600" />
                            <span className="text-lg font-semibold">Create Batch</span>
                            <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.status.replace('-', ' ')}
                            </Badge>
                        </div>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </Button> */}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        <p className="text-base text-gray-600">Loading task data...</p>
                    </div>
                ) : (
                    <div className="p-4">
                        {/* Task Progress Summary - Compact version */}
                        {role === "lineManager" && taskData && (
                            <Alert className="mb-4 border-l-4 border-l-blue-500 bg-blue-50 py-3">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span>
                                            <strong>Progress:</strong> {completedUnits || 0}/{taskData.TotalNoOfUnits} 
                                            <span className="text-blue-600 font-medium ml-1">({getCompletionPercentage()}%)</span>
                                        </span>
                                        {watchedRemainingUnits > 0 && (
                                            <Badge variant="outline" className="text-xs text-orange-700 border-orange-300 bg-orange-50">
                                                {watchedRemainingUnits} pending
                                            </Badge>
                                        )}
                                    </div>
                                    {taskData.TotalNoOfUnits && (
                                        <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                                            <div 
                                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                                style={{ width: `${getCompletionPercentage()}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                                
                                {/* READ-ONLY SECTION - Task Details */}
                                {role === "lineManager" && taskData && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lock className="h-4 w-4 text-slate-500" />
                                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                                Task Details (Read-only)
                                            </h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Product Name - Read Only */}
                                            <FormField 
                                                control={methods.control} 
                                                name="name" 
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            Product Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field}
                                                                readOnly={isFieldReadOnly("name")}
                                                                className="bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed text-sm font-medium"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )} 
                                            />

                                            {/* Price - Read Only */}
                                            <FormField 
                                                control={methods.control} 
                                                name="price" 
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            Unit Price (₹)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                {...field} 
                                                                readOnly={isFieldReadOnly("price")}
                                                                className="bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed text-sm font-medium"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )} 
                                            />

                                            {/* Total Units - Read Only */}
                                            <FormField 
                                                control={methods.control} 
                                                name="TotalNoOfUnits" 
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            Total Units
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                {...field} 
                                                                readOnly={isFieldReadOnly("TotalNoOfUnits")}
                                                                className="bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed text-sm font-medium"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )} 
                                            />

                                            {/* Location - Read Only */}
                                            <FormField 
                                                control={methods.control} 
                                                name="location" 
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            Production Location
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="text" 
                                                                {...field} 
                                                                readOnly={isFieldReadOnly("location")}
                                                                className="bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed text-sm font-medium"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )} 
                                            />

                                            {/* Remaining Units - Special styling */}
                                            <FormField 
                                                control={methods.control} 
                                                name="remainingUnits" 
                                                render={({ field }) => (
                                                    <FormItem className="col-span-2">
                                                        <FormLabel className="text-xs font-medium text-orange-600 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Remaining Units to Process
                                                            {watchedRemainingUnits > 0 && (
                                                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 ml-1">
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                type="number" 
                                                                {...field} 
                                                                readOnly={isFieldReadOnly("remainingUnits")}
                                                                className="bg-orange-50 border-orange-200 text-orange-800 cursor-not-allowed text-sm font-bold"
                                                            />
                                                        </FormControl>
                                                        {watchedRemainingUnits > 0 && (
                                                            <p className="text-xs text-orange-600 mt-1">
                                                                ⚠️ {watchedRemainingUnits} units need QR code generation
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )} 
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* EDITABLE SECTION - Batch Configuration */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Edit3 className="h-4 w-4 text-green-600" />
                                        <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                                            Batch Configuration (Editable)
                                        </h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* For manufacturers, show all editable fields here */}
                                        {role === 'manufacturer' && (
                                            <>
                                                {/* Product Name - Editable for manufacturer */}
                                                <FormField 
                                                    control={methods.control} 
                                                    name="name" 
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-medium text-green-700">Product Name</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    placeholder="Enter Product Name" 
                                                                    {...field}
                                                                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} 
                                                />

                                                {/* Price - Editable for manufacturer */}
                                                <FormField 
                                                    control={methods.control} 
                                                    name="price" 
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-medium text-green-700">Unit Price (₹)</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    type="number" 
                                                                    placeholder="Enter Unit Price" 
                                                                    {...field} 
                                                                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} 
                                                />

                                                {/* Total Units - Editable for manufacturer */}
                                                <FormField 
                                                    control={methods.control} 
                                                    name="TotalNoOfUnits" 
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-medium text-green-700">Total Units</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    type="number" 
                                                                    placeholder="Enter Total Units" 
                                                                    {...field} 
                                                                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} 
                                                />

                                                {/* Location - Editable for manufacturer */}
                                                <FormField 
                                                    control={methods.control} 
                                                    name="location" 
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs font-medium text-green-700">Production Location</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                    type="text" 
                                                                    placeholder="Enter Location" 
                                                                    {...field} 
                                                                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} 
                                                />
                                            </>
                                        )}

                                        {/* Batch No - Always editable */}
                                        <FormField 
                                            control={methods.control} 
                                            name="batchNo" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-green-700">Batch Number</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="Enter Batch Number" 
                                                            {...field} 
                                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} 
                                        />

                                        {/* Date - Always editable */}
                                        <FormField 
                                            control={methods.control} 
                                            name="date" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-green-700">Production Date</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 z-10" size={16} />
                                                            <Input
                                                                type="date" 
                                                                className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                                                                {...field}
                                                                value={field.value ? new Date(field.value).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
                                                                onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} 
                                        />

                                        {/* Start Serial No */}
                                        <FormField 
                                            control={methods.control} 
                                            name="startSerialNo" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-green-700">Start Serial Number</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            {...field} 
                                                            readOnly={role === 'lineManager'}
                                                            className={`${
                                                                role === "lineManager" 
                                                                    ? "bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed" 
                                                                    : "border-green-300 focus:border-green-500 focus:ring-green-500"
                                                            }`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} 
                                        />

                                        {/* End Serial No - Always editable */}
                                        <FormField 
                                            control={methods.control} 
                                            name="endSerialNo" 
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-medium text-green-700">End Serial Number</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            type="number" 
                                                            {...field} 
                                                            onBlur={handleEndSerialChange} 
                                                            placeholder="End Serial Number"
                                                            className="border-green-300 focus:border-green-500 focus:ring-green-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} 
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons - Compact */}
                                <div className="flex gap-2 pt-3 border-t bg-white">
                                    
                                    {/* <Button 
                                        type="submit" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all duration-200 flex-1 text-sm"
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        Create QR Codes
                                    </Button> */}
                                    <Button 
  type="submit" 
  disabled={taskData?.completedUnits === taskData?.TotalNoOfUnits}
  className={`px-4 py-2 rounded transition-all duration-200 flex-1 text-sm flex items-center justify-center 
    ${taskData?.completedUnits === taskData?.TotalNoOfUnits 
      ? "bg-gray-400 cursor-not-allowed" 
      : "bg-blue-600 hover:bg-blue-700 text-white"}`}
>
  <Package className="w-4 h-4 mr-2" />
  Create QR Codes
</Button>


                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleCancelEvent}
                                        className="px-4 py-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
                                    >
                                        Cancel
                                    </Button>

                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        onClick={handleDeleteEvent}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-all duration-200 text-sm"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}


