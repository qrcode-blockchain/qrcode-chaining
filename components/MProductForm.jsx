"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MproductSchema } from "../Schema/productSchema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from "./ui/form";
import { Calendar1Icon } from "lucide-react";
import { useToast } from "../hooks/useToast";

const emptyValues = {
    name: "",
    batchNo: "",
    startSerialNo: 1,
    endSerialNo: '',
    price: '',
    date: "",
    location: ""
};

export default function MProductForm({ 
    onSave, 
    selectedProduct, 
    onCancel, 
    onDelete, 
    lastUsedSerialNo,
    setLastUsedSerialNo,
    totalUnits
}) {
    const { toast } = useToast();
    const [calculatedUnits, setCalculatedUnits] = useState(0);
    const [loading, setLoading] = useState(false);
    
    const methods = useForm({
        resolver: zodResolver(MproductSchema),
        defaultValues: {
            ...(selectedProduct || emptyValues),
            startSerialNo: selectedProduct?.startSerialNo || lastUsedSerialNo || 1
        }
    });
   
    const { reset, handleSubmit, setValue, watch } = methods;
    
    // Watch for changes to calculate units in real-time
    const startSerialNo = watch("startSerialNo");
    const endSerialNo = watch("endSerialNo");
    
    // Calculate units whenever start or end serial changes
    useEffect(() => {
        if (endSerialNo && startSerialNo) {
            const start = Number(startSerialNo);
            const end = Number(endSerialNo);
            
            if (end >= start) {
                const units = end - start + 1;
                setCalculatedUnits(units);
            } else {
                setCalculatedUnits(0);
            }
        } else {
            setCalculatedUnits(0);
        }
    }, [startSerialNo, endSerialNo]);

    // Reset form when selectedProduct changes
    useEffect(() => {
        if (selectedProduct) {
            reset(selectedProduct);
            // Calculate units for selected product
            const units = selectedProduct.endSerialNo - selectedProduct.startSerialNo + 1;
            setCalculatedUnits(units);
        }
    }, [selectedProduct, reset]);

    // Update start serial number when lastUsedSerialNo changes
    useEffect(() => {
        if (!selectedProduct) {
            setValue("startSerialNo", lastUsedSerialNo);
        }
    }, [lastUsedSerialNo, selectedProduct, setValue]);

    const handleEndSerialChange = (e) => {
        const endSerialNo = Number(e.target.value);
        const startSerialNo = Number(watch("startSerialNo"));
        
        if (endSerialNo < startSerialNo) {
            toast({
                title: "Invalid Serial Number",
                description: "End serial number must be greater than or equal to start serial number",
                variant: 'destructive'
            });
        }
    };

    const getPreservedValues = () => {
        const preservedValues = { ...emptyValues };
        preservedValues.startSerialNo = lastUsedSerialNo;
        return preservedValues;
    };

    const handleSubmitForm = (data) => { 
        try {
            console.log("The data is submitted in products form before",data);
            onSave(data);
            console.log("The data is submitted in products form after",data);
            
            // Reset form with updated values
            const resetValues = getPreservedValues();
            resetValues.startSerialNo = data.endSerialNo + 1;
            resetValues.endSerialNo = '';
            resetValues.name=data.name;
            resetValues.location=data.location;
            resetValues.price=data.price;
            resetValues.date=data.date;
            reset(resetValues);
        } catch (error) {
            console.log('The error is',error);
            
        }
       
    };

    const handleCancelEvent = () => {
        onCancel();
        methods.reset(getPreservedValues());
        setCalculatedUnits(0);
    };

    const handleDeleteEvent = () => {
        if (!selectedProduct) return;
        onDelete(selectedProduct);
        reset(getPreservedValues());
        setCalculatedUnits(0);
    };
       
    if (loading) {
        return <div className="p-4 text-center">Loading form data...</div>;
    }
    
    return (
        <div className="bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Product Details</h2>
                <div className="flex gap-2">
                    
                    <div className="text-sm bg-green-800/50 px-3 py-1 rounded-full">
                        Total Units: <span className="font-bold">{totalUnits}</span>
                    </div>
                </div>
            </div>
             
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-2 gap-2">
                    {/* Product Name */}
                    <FormField control={methods.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Product Name" {...field} />
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

                    {/* Location */}
                    <FormField control={methods.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input 
                                    type="text" 
                                    placeholder="Enter Location" 
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Start Serial No */}
                    <FormField control={methods.control} name="startSerialNo" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Serial No</FormLabel>
                            <FormControl>
                                <Input type="number" readOnly
                                 className="cursor-not-allowed" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    {/* End Serial No */}
                    <FormField control={methods.control} name="endSerialNo" render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Serial No</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    {...field} 
                                    onBlur={handleEndSerialChange} 
                                    placeholder="End Serial Number"
                                />
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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 col-span-2 gap-1 mt-4">
                        {/* Save Button */}
                        <Button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-400"
                            disabled={!calculatedUnits}
                        >
                            {selectedProduct ? 'Update Product' : 'Create Product'}
                        </Button>

                        {/* Cancel Button */}
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="border-blue-600 text-blue-600" 
                            onClick={handleCancelEvent}
                        >
                            Cancel
                        </Button>

                        {/* Delete Button */}
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={handleDeleteEvent}
                            disabled={!selectedProduct}
                        >
                            Delete
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}