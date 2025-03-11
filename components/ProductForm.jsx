"use client";

import React, { useEffect } from "react";
import InfoTip from "./InfoTip";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../Schema/productSchema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

const emptyValues = {
    name: "",
    batchNo: "",
    serialNo: 0,
    price: 0,
    date: "",
    amount: 0,
    location: ""
}

export default function ProductForm({ onSave, selectedProduct, onCancel, onDelete}) {
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
        <Card className="bg-blue-900/30 p-4 border border-blue-400/20 rounded-lg shadow-lg">
            <CardContent>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-2 gap-4">
                        {/* Product Name */}
                        <div>
                            <label className="block text-white font-medium mb-1">Product Name</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        {...methods.register("name")} 
                                        placeholder="Enter Product Name" 
                                    />
                                }
                                message={<p>The Name of the Product</p>}
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-1">Batch No</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        {...methods.register("batchNo")} 
                                        placeholder="Enter Batch No" 
                                    />
                                }
                                message={<p>Product's Batch No or Batch ID</p>}
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-1">Serial No</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        {...methods.register("serialNo")} 
                                        type="number"
                                        placeholder="Enter Serial No" 
                                    />
                                }
                                message={<p>Serial No of Product</p>}
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-1">Price</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        {...methods.register("price")} 
                                        type="number"
                                        placeholder="Enter Price" 
                                    />
                                }
                                message={<p>Price of Product</p>}
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-1">Date</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        type="date" 
                                        {...methods.register("date")} 
                                        placeholder="Select Date" 
                                    />
                                }
                                message={<p>Manufacturing Date of Product</p>}
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-1">Amount</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        {...methods.register("amount")} 
                                        type="number"
                                        placeholder="Enter Amount" 
                                    />
                                }
                                message={<p>Amount of Products to be Manufactured</p>}
                            />
                        </div>

                        <div>
                            <label className="block text-white font-medium mb-1">Location</label>
                            <InfoTip 
                                Component={
                                    <Input 
                                        {...methods.register("location")} 
                                        placeholder="Enter Location" 
                                    />
                                }
                                message={<p>Location of Manufacturing Plant</p>}
                            />
                        </div>

                        <div className="col-span-2 grid grid-cols-3 gap-2 mt-4">
                            <Button 
                                type="submit" 
                                className="bg-blue-600 text-white hover:bg-blue-500 transition"
                            >
                                Save Product
                            </Button>
                            
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCancelEvent} 
                                className="border border-blue-600 text-blue-600"
                            >
                                Cancel
                            </Button>

                            <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={handleDeleteEvent}
                                className="bg-red-600 text-white hover:bg-red-500 transition"
                            >
                                Delete
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </CardContent>
        </Card>
    );
}