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
const emptyValues = {
    name: "",
    batchNo: "",
    serialNo: 0,
    price: 0,
    date: "",
    amount: 0,
    location: ""
};

export default function ProductForm({ onSave, selectedProduct, onCancel, onDelete ,taskId,role}) {
    const {toast}=useToast();
    const methods = useForm({
        resolver: zodResolver(productSchema), 
        defaultValues: selectedProduct || emptyValues
    });
    const [taskData,setTaskData]=useState(null);
    
    const { reset, handleSubmit,setValue } = methods;
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        if (selectedProduct) {
            reset(selectedProduct);
        }
    }, [selectedProduct, reset]);

useEffect(()=>{
    const fetchTaskData = async () => {
        if (role === "lineManager" && taskId) {
            setLoading(true);
            try {
                const response = await axios.get('/api/lineManagers/fetch-assigned-task');
                if (response.data.success) {
                    // Find the specific task with matching taskId
                    const task = response.data.tasks.find(t => t._id === taskId);
                    console.log("The task data is",task);
                    
                    if (task) {
                        setTaskData(task);
                        
                        // Pre-populate form with task data
                        if (task.productName) setValue("name", task.productName);
                        if (task.productPrice) setValue("price", task.productPrice);
                        if (task.NoOfUnits) setValue("amount", task.NoOfUnits);
                        if(task.location) setValue("location",task.location);
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
},[taskId,role,setValue])

const getPreservedValues = () => {
    const preservedValues = { ...emptyValues };
    
    if (role === "lineManager" && taskId && taskData) {
        if ('productName' in taskData) preservedValues.name = taskData.productName;
        if ('productPrice' in taskData) preservedValues.price = taskData.productPrice;
        if ('NoOfUnits' in taskData) preservedValues.amount = taskData.NoOfUnits;
        if ('location' in taskData) preservedValues.location = taskData.location;
    }
    
    return preservedValues;
};

    const handleSubmitForm = (data) => { 
        onSave(data);
        methods.reset(getPreservedValues());
    };

    const handleCancelEvent = () => {
        onCancel();
        methods.reset(getPreservedValues());
    };

    const handleDeleteEvent = () => {
        if (!selectedProduct) return;
        onDelete(selectedProduct.serialNo);
        methods.reset(getPreservedValues());
    };
        //to determivne if a feld is ready only
        const isFieldReadOnly = (fieldName) => {
            if (role !== "lineManager" || !taskId || !taskData) return false;
            
            // Map task fields to form fields
            const readOnlyFieldMap = {
                "name": "productName" in taskData,
                "price": "productPrice" in taskData,
                "amount": "NoOfUnits" in taskData,
                "location":"location" in taskData,
            };
            
            return readOnlyFieldMap[fieldName] || false;
        };
        if (loading) {
            return <div className="p-4 text-center">Loading form data...</div>;
        }
    return (
        <div className="bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
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
                                <Input placeholder="Enter Batch No." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Serial No */}
                    <FormField control={methods.control} name="serialNo" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Serial No</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter Serial No." {...field} />
                            </FormControl>
                            <FormMessage />
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
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Amount */}
                    <FormField control={methods.control} name="amount" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount of Products</FormLabel>
                            <FormControl>
                            <Input 
                                    type="number" 
                                    placeholder="Enter Amount" 
                                    {...field} 
                                    readOnly={isFieldReadOnly("amount")}
                                    className={isFieldReadOnly("amount") ? "bg-gray-500 cursor-not-allowed" : ""}
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
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-400">
                            Create QRCodes
                        </Button>

                        {/* Cancel Button */}
                        <Button type="button" variant="outline" className="border-blue-600 text-blue-600" onClick={handleCancelEvent}>
                            Cancel
                        </Button>

                        {/* Delete Button */}
                        <Button type="button" variant="destructive" onClick={handleDeleteEvent}>
                            Delete
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
