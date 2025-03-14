"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../Schema/productSchema";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from "./ui/form";
import { Calendar1Icon } from "lucide-react";

const emptyValues = {
    name: "",
    batchNo: "",
    serialNo: 0,
    price: 0,
    date: "",
    amount: 0,
    location: ""
};

export default function ProductForm({ onSave, selectedProduct, onCancel, onDelete }) {
    const methods = useForm({
        resolver: zodResolver(productSchema), 
        defaultValues: selectedProduct || emptyValues
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (selectedProduct) {
            reset(selectedProduct);
        }
    }, [selectedProduct, reset]);

    const handleSubmitForm = (data) => { 
        onSave(data);
        methods.reset(emptyValues);
    };

    const handleCancelEvent = () => {
        onCancel();
        methods.reset(emptyValues);
    };

    const handleDeleteEvent = () => {
        if (!selectedProduct) return;
        onDelete(selectedProduct.serialNo);
        methods.reset(emptyValues);
    };

    return (
        <div className="bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
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
                                <Input type="number" placeholder="Enter Price" {...field} />
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
                                <Input type="number" placeholder="Enter Amount" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Location */}
                    <FormField control={methods.control} name="location" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Location" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 col-span-2 gap-1">
                        {/* Save Button */}
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-400">
                            Save Product
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
