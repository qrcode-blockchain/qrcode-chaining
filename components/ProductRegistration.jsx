"use client";

import ProductForm from "./ProductForm.jsx";
import { useState, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
    AlertDialogAction, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from "@/components/ui/alert-dialog.jsx";

export default function ProductRegistration() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

      const handleSaveProduct = (product) => {
        setProducts((prevProducts) => {
            const existingIndex = prevProducts.findIndex((p) => p.serialNo === product.serialNo);
            let updatedProducts;
    
            if (existingIndex !== -1) {
                updatedProducts = prevProducts.map((p, index) => index === existingIndex ? product : p);
            } else {
                updatedProducts = [...prevProducts, product];
            }
    
            localStorage.setItem("products", JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    
        setSelectedProduct(null);
    };

    useEffect(() => {
        if (typeof window !== undefined) {
            const storedProducts = localStorage.getItem("products");
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
        }
    }, []);

    const handleCancel = () => setSelectedProduct(null);

    const handleDelete = (serialNo) => {
        const updatedProducts = products.filter((p) => (p.serialNo !== serialNo));
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
    };
    
    const submitAllProducts = () => {
        const productsList = localStorage.getItem("products");
        localStorage.removeItem("products");
        setProducts([]);
        console.log(products)
    }

    return (<div className="flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg p-2">
    <div className="w-full flex gap-2">
        <TableProperties className="text-white bg-none" size={32}/>
        <h1 className="text-2xl font-semibold text-white">Product Registration</h1>
    </div>
    <div className="grid grid-cols-3 gap-2 p-6 space-y-6 w-full">
        <ProductForm onSave={ handleSaveProduct } selectedProduct={ selectedProduct } onCancel={ handleCancel } onDelete={ handleDelete } className=""/>
        <div className="col-span-2 border rounded-md p-4 bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Batch No</TableHead>
                        <TableHead>Serial No</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Location</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={ index } onClick={() => setSelectedProduct(product)} className="cursor-pointer hover:bg-gray-100">
                            <TableCell>{ product.name }</TableCell>
                            <TableCell>{ product.batchNo }</TableCell>
                            <TableCell>{ product.serialNo }</TableCell>
                            <TableCell>{ product.amount }</TableCell>
                            <TableCell>{ product.expiryDate }</TableCell>
                            <TableCell>{ product.location }</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="primary" className="bg-blue-600 text-white col-span-3" onClick= { submitAllProducts }>Submit</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                    <AlertDialogDescription>Please make sure all the Product Data is correct before Proceeding</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction>Submit</AlertDialogAction>
                    <AlertDialogCancel>Check Again</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
    </div>);
}