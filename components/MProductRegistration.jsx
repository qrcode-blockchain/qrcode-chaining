
"use client";

import MProductForm from "./MProductForm.jsx";
import { useState, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Button } from "./ui/button.jsx";

export default function MProductRegistration() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [totalUnits, setTotalUnits] = useState(0);
    const [lastUsedSerialNo, setLastUsedSerialNo] = useState(1);
   
    useEffect(() => {
        const loadInitialState = async () => {
            try {
                const storedProducts = localStorage.getItem("products");
                const storedTotalUnits = localStorage.getItem("totalUnits");
                const storedLastSerialNo = localStorage.getItem("lastUsedSerialNo");
                
                if (storedProducts) {
                    const parsedProducts = JSON.parse(storedProducts);
                    setProducts(parsedProducts);
    
                    // Calculate total units from products if not stored
                    if (!storedTotalUnits) {
                        const calculatedTotalUnits = parsedProducts.reduce((total, product) => 
                            total + (product.endSerialNo - product.startSerialNo + 1), 0);
                        setTotalUnits(calculatedTotalUnits);
                        localStorage.setItem("totalUnits", calculatedTotalUnits.toString());
                    }
    
                    // Calculate last used serial number
                    const maxEndSerialNo = parsedProducts.reduce((max, product) => 
                        Math.max(max, product.endSerialNo), 0);
                    setLastUsedSerialNo(maxEndSerialNo + 1);
                    localStorage.setItem("lastUsedSerialNo", (maxEndSerialNo + 1).toString());
                }
    
                if (storedTotalUnits) setTotalUnits(Number(storedTotalUnits));
                if (storedLastSerialNo) setLastUsedSerialNo(Number(storedLastSerialNo));
            } catch (error) {
                console.error("Error loading initial state:", error);
                // Set defaults if there's an error
                setProducts([]);
                setTotalUnits(0);
                setLastUsedSerialNo(1);
            }
        };
    
        loadInitialState();
    }, []);

    // Save or update product in state and localStorage
    // const handleSaveProduct = (product) => {
    //     console.log('It is hitting this api');
        
    //     // Calculate the units for the product
    //     const productUnits = product.endSerialNo - product.startSerialNo + 1;
        
    //     // Check if this is an update to an existing product
    //     const existingProductIndex = products.findIndex(p => 
    //         p.name === product.name && 
    //         p.batchNo === product.batchNo && 
    //         p.startSerialNo === product.startSerialNo);
        
    //     let updatedProducts;
    //     let newTotalUnits = totalUnits;
        
    //     // If updating an existing product
    //     if (existingProductIndex !== -1) {
    //         const existingProduct = products[existingProductIndex];
    //         const existingUnits = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
            
    //         // Update total units by removing old units and adding new units
    //         newTotalUnits = totalUnits - existingUnits + productUnits;
            
    //         // Update product in array
    //         updatedProducts = [...products];
    //         updatedProducts[existingProductIndex] = product;
    //     } else {
    //         // It's a new product, just add the new units
    //         newTotalUnits = totalUnits + productUnits;
            
    //         // Add to products array
    //         updatedProducts = [...products, product];
            
    //         // Update last used serial number
    //         setLastUsedSerialNo(product.endSerialNo + 1);
    //         localStorage.setItem("lastUsedSerialNo", (product.endSerialNo + 1).toString());
    //     }
        
    //     // Update products state and localStorage
    //     setProducts(updatedProducts);
    //     localStorage.setItem("products", JSON.stringify(updatedProducts));
        
    //     // Update total units state and localStorage
    //     setTotalUnits(newTotalUnits);
    //     localStorage.setItem("totalUnits", newTotalUnits.toString());
        
    //     // Clear selected product
    //     setSelectedProduct(null);
    // };
// Save or update product in state and localStorage
const handleSaveProduct = (product) => {
    console.log('It is hitting this api');
    
    // Add timestamp to the product
    const productWithTimestamp = {
        ...product,
        timestamp: new Date().toISOString() // Store as ISO string for consistent formatting
    };
    
    // Calculate the units for the product
    const productUnits = productWithTimestamp.endSerialNo - productWithTimestamp.startSerialNo + 1;
    
    // Check if this is an update to an existing product
    const existingProductIndex = products.findIndex(p => 
        p.name === productWithTimestamp.name && 
        p.batchNo === productWithTimestamp.batchNo && 
        p.startSerialNo === productWithTimestamp.startSerialNo);
    
    let updatedProducts;
    let newTotalUnits = totalUnits;
    
    // If updating an existing product
    if (existingProductIndex !== -1) {
        const existingProduct = products[existingProductIndex];
        const existingUnits = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
        
        // Update total units by removing old units and adding new units
        newTotalUnits = totalUnits - existingUnits + productUnits;
        
        // Update product in array
        updatedProducts = [...products];
        updatedProducts[existingProductIndex] = productWithTimestamp;
    } else {
        // It's a new product, just add the new units
        newTotalUnits = totalUnits + productUnits;
        
        // Add to products array
        updatedProducts = [...products, productWithTimestamp];
        
        // Update last used serial number
        setLastUsedSerialNo(productWithTimestamp.endSerialNo + 1);
        localStorage.setItem("lastUsedSerialNo", (productWithTimestamp.endSerialNo + 1).toString());
    }
    
    // Update products state and localStorage
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    
    // Update total units state and localStorage
    setTotalUnits(newTotalUnits);
    localStorage.setItem("totalUnits", newTotalUnits.toString());
    
    // Clear selected product
    setSelectedProduct(null);
};
    // Cancel editing
    const handleCancel = () => setSelectedProduct(null);

    // Delete product from state and localStorage
    const handleDelete = (productToDelete) => {
        // Calculate units to remove
        const unitsToRemove = productToDelete.endSerialNo - productToDelete.startSerialNo + 1;
        
        // Remove product from array
        const updatedProducts = products.filter(p => 
            !(p.name === productToDelete.name && 
              p.batchNo === productToDelete.batchNo && 
              p.startSerialNo === productToDelete.startSerialNo));
        
        // Update total units
        const newTotalUnits = totalUnits - unitsToRemove;
        
        // Update state and localStorage
        setProducts(updatedProducts);
        setTotalUnits(newTotalUnits);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        localStorage.setItem("totalUnits", newTotalUnits.toString());
        
        // Find next appropriate serial number
        const newLastUsedSerialNo = determineNextSerialNumber(updatedProducts);
        setLastUsedSerialNo(newLastUsedSerialNo);
        localStorage.setItem("lastUsedSerialNo", newLastUsedSerialNo.toString());
        
        // Deselect the product
        setSelectedProduct(null);
    };

    // Helper function to determine the next serial number after deletion
    const determineNextSerialNumber = (productArray) => {
        if (productArray.length === 0) return 1;
        
        // Sort products by endSerialNo
        const sortedProducts = [...productArray].sort((a, b) => a.endSerialNo - b.endSerialNo);
        
        // Return highest endSerialNo + 1
        return sortedProducts[sortedProducts.length - 1].endSerialNo + 1;
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
              const storedTotalUnits = localStorage.getItem("totalUnits");
            const response = await fetch("/api/products/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    storedTotalUnits
                },
                body: JSON.stringify({ products: products }),
            });
    
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit products');
            }
            
            // Reset state and localStorage after successful submission
            localStorage.removeItem("products");
            localStorage.removeItem("totalUnits");
            localStorage.removeItem("lastUsedSerialNo");

            setProducts([]);
            setTotalUnits(0);
            setLastUsedSerialNo(1);
            setSuccess(true);
            
            const res = await axios.get('/api/products/submit');
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
                <div className="ml-auto text-sm bg-green-700/50 px-4 py-2 rounded-full flex items-center">
                    Total Units: <span className="font-bold ml-1">{totalUnits}</span>
                </div>
            </div>
            
            {/* Main Section */}
            <div className="grid grid-cols-3 gap-2 p-6 w-full">
                {/* Product Form */}
                <MProductForm 
                    onSave={handleSaveProduct} 
                    selectedProduct={selectedProduct} 
                    onCancel={handleCancel} 
                    onDelete={handleDelete} 
                    lastUsedSerialNo={lastUsedSerialNo}
                    setLastUsedSerialNo={setLastUsedSerialNo}
                    totalUnits={totalUnits}
                />
                
                {/* Table */}
                <div className="col-span-2 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-semibold">Product List</h2>
                        <div className="text-sm bg-blue-800/50 px-3 py-1 rounded-full">
                            Total Units: <span className="font-bold">{totalUnits}</span>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="border-b border-blue-400/20">
                            <tr>
                                <th className="p-2">Name</th>
                                <th className="p-2">Batch No</th>
                                <th className="p-2">No of Units</th>
                                <th className="p-2">Start Serial</th>
                                <th className="p-2">End Serial</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Time</th>
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
                                    <td className="p-2">{product.endSerialNo - product.startSerialNo + 1}</td>
                                    <td className="p-2">{product.startSerialNo}</td>
                                    <td className="p-2">{product.endSerialNo}</td>
                                    <td className="p-2">{new Date(product.date).toLocaleDateString()}</td>
                                    <td className="p-2">{product.timestamp ? new Date(product.timestamp).toLocaleTimeString() : "N/A"}</td>
                                    <td className="p-2">{product.location}</td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-4 text-center text-gray-400">
                                        No products created yet
                                    </td>
                                </tr>
                            )}
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