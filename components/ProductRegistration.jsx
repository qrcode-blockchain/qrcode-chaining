"use client";

import ProductForm from "./ProductForm.jsx";
import { useState, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { 
    AlertDialog, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogAction, 
    AlertDialogContent, 
    AlertDialogTitle, 
    AlertDialogTrigger, 
    AlertDialogCancel 
} from "./ui/alert-dialog.jsx";

export default function ProductRegistration() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedProducts = localStorage.getItem("products");
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
        }
    }, []);

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

    const handleCancel = () => setSelectedProduct(null);

    const handleDelete = (serialNo) => {
        const updatedProducts = products.filter((p) => (p.serialNo !== serialNo));
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
    };

    const submitAllProducts = async () => {
        if (products.length === 0) {
            setError("No products to submit.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);
    
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ products: products }),
            });
    
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit products');
            }
            
            localStorage.removeItem("products");
            setProducts([]);
            setSuccess(true);
            setIsDialogOpen(false);

            const resp = await fetch("/api/products", {
                method: "GET",
            });
    
            const getData = await resp.json();
    
            if (!resp.ok) {
                throw new Error(getData.message || "Error generating IDs");
            }    
            
        } catch (error) {
            console.error("Error submitting products:", error);
            setError(error.message || "Failed to submit products. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col bg-blue-900/30 backdrop-blur-lg p-2 rounded-md border-blue-400/20">
            <div className="w-full flex gap-2 m-2">
                <TableProperties className="text-white bg-none" size={32}/>
                <h1 className="text-2xl font-semibold text-white">Product Registration</h1>
            </div>
            
            <div className="grid grid-cols-3 gap-2 p-6 space-y-6 w-full">
                <ProductForm 
                    onSave={handleSaveProduct} 
                    selectedProduct={selectedProduct} 
                    onCancel={handleCancel} 
                    onDelete={handleDelete} 
                />
                
                <div className="col-span-2 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                    <Table>
                        <TableHeader>
                            <TableRow >
                                <TableHead>Name</TableHead>
                                <TableHead>Batch No</TableHead>
                                <TableHead>Serial No</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow 
                                    key={index} 
                                    onClick={() => setSelectedProduct(product)} 
                                    className="cursor-pointer hover:bg-blue-500/20 transition"
                                >
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.batchNo}</TableCell>
                                    <TableCell>{product.serialNo}</TableCell>
                                    <TableCell>{product.amount}</TableCell>
                                    <TableCell>{product.date}</TableCell>
                                    <TableCell>{product.location}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {error && (
                    <div className="col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        Products submitted successfully!
                    </div>
                )}

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button 
                            variant="primary" 
                            className="bg-blue-600 text-white col-span-3"
                            disabled={isSubmitting || products.length === 0}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit All Products'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please make sure all the Product Data is correct before Proceeding
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={submitAllProducts}>Submit</AlertDialogAction>
                            <AlertDialogCancel>Check Again</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}