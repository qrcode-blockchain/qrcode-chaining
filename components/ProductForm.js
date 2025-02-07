"use client";

import { z } from "zod";
import React from "react";
import InfoTip from "./InfoTip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect } from "react";
import { Calendar1Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormField, FormLabel, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const productSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
    batchNo: z.string().min(1, { message: "Batch No. is required." }),
    serialNo: z.string().min(1, { message: "Serial No. is required." }),
    expiryDate: z.string({ required_error: "Expiry Date is required." }),
    manufacturingDate: z.string({ required_error: "Manufacturing Date is required." }),
    amount: z.string({ invalid_type_error: "Amount must be a number." }).min(1, { message: "Amount must be at least 1." }),
    location: z.string().min(3, { message: "Location must be at least 3 characters." }),
});

export default function ProductForm({ onSave, selectedProduct, onCancel, onDelete}) {
    const methods = useForm({
        resolver: zodResolver(productSchema), 
        defaultValues:  selectedProduct || {
            name: "",
            batchNo: "",
            serialNo: "",
            expiryDate: null,
            manufacturingDate: null,
            amount: 0,
            location: ""
        }
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (selectedProduct) {
            reset(selectedProduct);
        }
    }, [selectedProduct, reset]);

    const handleSubmitForm = (data) => { 
        onSave(data);
        methods.reset({
            name: "",
            batchNo: "",
            serialNo: "",
            expiryDate: null,
            manufacturingDate: null,
            amount: 0,
            location: ""
        });
    };

    const handleCancelEvent = () => {
        onCancel();
        methods.reset({
            name: "",
            batchNo: "",
            serialNo: "",
            expiryDate: null,
            manufacturingDate: null,
            amount: 0,
            location: ""
        });
    };

    const handleDeleteEvent = () => {
        if (!selectedProduct) return;
        onDelete(selectedProduct.serialNo);
        methods.reset({
            name: "",
            batchNo: "",
            serialNo: "",
            expiryDate: null,
            manufacturingDate: null,
            amount: 0,
            location: ""
        });
    };


    return (<Card className="">
        <CardContent>
                <FormProvider {...methods}>
                <form onSubmit={ handleSubmit(handleSubmitForm) } className="grid grid-cols-2 p-2 gap-2">
                    <FormField control={ methods.control } name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <InfoTip Component={ <Input placeholder="Enter Product Name" {...field}/> } message={ <p>The Name of the Product</p> }/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={methods.control} name="batchNo" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Batch No</FormLabel>
                            <FormControl>
                                <InfoTip Component={ <Input placeholder="Enter Batch No." {...field} />} message={ <p>Product's Batch No or Batch ID</p> }/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={methods.control} name="serialNo" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Serial No</FormLabel>
                            <FormControl>
                                <InfoTip Component={ <Input placeholder="Enter Serial No." {...field} /> } message={ <p>Serial No. of Product</p> }/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                        
                    <FormField control={methods.control} name="expiryDate" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        <Calendar1Icon /> { field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span> }
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={ new Date(field.value) } onSelect={(date) => field.onChange(date.toISOString())} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Expiry Date of Product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormControl>
                        </FormItem>
                    )} />
                        
                    <FormField control={methods.control} name="manufacturingDate" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Manufacturing Date</FormLabel>
                            <FormControl>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        <Calendar1Icon /> {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={ field.value } onSelect={(date) => field.onChange(date.toISOString())} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Manufacturing Date of Product</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormControl>
                        </FormItem>
                    )} />
                        
                    <FormField control={methods.control} name="amount" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Amount of Products</FormLabel>
                            <FormControl>
                                <InfoTip Component={ <Input type="number" placeholder="Enter Amount" {...field} /> } message={ <p>Amount of Products to be Manufactured</p> }/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={methods.control} name="location" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <InfoTip Component={ <Input placeholder="Enter Location" {...field} /> } message={ <p>Location of Manufacturing Plant</p> }/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                        
                    <div className="grid grid-cols-3 col-span-2 gap-1 grid-rows-1">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-400">Save Product</Button>
                        <Button type="button" variant="outline" className="bg-white-100 border-blue-600 text-blue-600" onClick={ handleCancelEvent }>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={ handleDeleteEvent }>Delete</Button>
                    </div>
                </form>
                </FormProvider>
        </CardContent>
    </Card>);
}