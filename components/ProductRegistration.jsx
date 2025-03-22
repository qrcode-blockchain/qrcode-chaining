"use client";

import ProductForm from "./ProductForm.jsx";
import { useState, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Button } from "./ui/button.jsx";

export default function ProductRegistration() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedProducts = localStorage.getItem("products");
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }
        }
    }, []);

    // Save or update product in state and localStorage
    const handleSaveProduct = (product) => {
        setProducts((prevProducts) => {  //if no previous product then null
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

    // Cancel editing
    const handleCancel = () => setSelectedProduct(null);

    // Delete product from state and localStorage
    const handleDelete = (serialNo) => {
        const updatedProducts = products.filter((p) => p.serialNo !== serialNo);
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
    };

    // Submit all products
    const submitAllProducts = async () => {
        if (products.length === 0) {
            setError("No products to submit.");
            return;
        }

        if (!confirm("Are you sure you want to submit all products?")) {
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
            {/* Header */}
            <div className="w-full flex gap-2 m-2">
                <TableProperties className="text-white bg-none" size={32}/>
                <h1 className="text-2xl font-semibold text-white">Product Registration</h1>
            </div>
            
            {/* Main Section */}
            <div className="grid grid-cols-3 gap-2 p-6 space-y-6 w-full">
                {/* Product Form */}
                <ProductForm 
                    onSave={handleSaveProduct} 
                    selectedProduct={selectedProduct} 
                    onCancel={handleCancel} 
                    onDelete={handleDelete} 
                />
                
                {/* Table */}
                <div className="col-span-2 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                    <table className="w-full text-left">
                        <thead className="border-b border-blue-400/20">
                            <tr>
                                <th className="p-2">Name</th>
                                <th className="p-2">Batch No</th>
                                <th className="p-2">Serial No</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr 
                                    key={index} 
                                    onClick={() => setSelectedProduct(product)} 
                                    className="cursor-pointer hover:bg-blue-500/20 transition"
                                >
                                    <td className="p-2">{product.name}</td>
                                    <td className="p-2">{product.batchNo}</td>
                                    <td className="p-2">{product.serialNo}</td>
                                    <td className="p-2">{product.amount}</td>
                                    <td className="p-2">{product.date}</td>
                                    <td className="p-2">{product.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Error Notification */}
                {error && (
                    <div className="col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Success Notification */}
                {success && (
                    <div className="col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        Products submitted successfully!
                    </div>
                )}

                {/* Submit Button */}
                <Button 
                    onClick={submitAllProducts}
                    className="bg-blue-600 text-white col-span-3"
                    disabled={isSubmitting || products.length === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit All Products'}
                </Button>
            </div>
        </div>
    );
}
