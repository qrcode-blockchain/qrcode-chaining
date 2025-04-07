// "use client";

// import ProductForm from "./ProductForm.jsx";
// import { useState, useEffect } from "react";
// import { TableProperties } from "lucide-react";
// import { Button } from "./ui/button.jsx";

// export default function ProductRegistration({taskId, role}) {
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);
//     const [remainingUnits, setRemainingUnits] = useState(0);
//     const [totalUnits, setTotalUnits] = useState(0);
//     const [lastUsedSerialNo, setLastUsedSerialNo] = useState(1);
   
//     useEffect(() => {
//         // This could be fetched from backend or localStorage
//         const loadInitialState = async () => {
//             try {
//                 // Fetch task details or use localStorage
//                 const storedProducts = localStorage.getItem("products");
//                 console.log("The stored products in localStorage is", storedProducts);
                
//                 const storedTotalUnits = localStorage.getItem("totalUnits");
//                 const storedRemainingUnits = localStorage.getItem("remainingUnits");
//                 console.log("The stored remaining units in local Storage is", storedRemainingUnits);
                
//                 const storedLastSerialNo = localStorage.getItem("lastUsedSerialNo");
//                 console.log("The stored last serial no in local Storage is", storedLastSerialNo);
                
//                 if (storedProducts) {
//                     const parsedProducts = JSON.parse(storedProducts);
//                     setProducts(parsedProducts);

//                     // Calculate last used serial number
//                     const maxEndSerialNo = parsedProducts.reduce((max, product) => 
//                         Math.max(max, product.endSerialNo), 0);
//                     setLastUsedSerialNo(maxEndSerialNo + 1);
//                 }

//                 if (storedTotalUnits) setTotalUnits(Number(storedTotalUnits));
                
//                 // Check if there are remaining units
//                 if (storedRemainingUnits) {
//                     const remainingUnitsValue = Number(storedRemainingUnits);
//                     setRemainingUnits(remainingUnitsValue);
                    
//                     // If no remaining units, don't update lastUsedSerialNo
//                     if (remainingUnitsValue <= 0 && storedLastSerialNo) {
//                         setLastUsedSerialNo(Number(storedLastSerialNo));
//                     } else if (storedLastSerialNo) {
//                         setLastUsedSerialNo(Number(storedLastSerialNo));
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error loading initial state:", error);
//             }
//         };

//         loadInitialState();
//     }, []);

//     // Save or update product in state and localStorage
//     // Save or update product in state and localStorage
// const handleSaveProduct = (product) => {
//     // First, check if this is an update to an existing product
//     const existingProductIndex = products.findIndex(existingProduct => {
//         return existingProduct.name === product.name &&
//             existingProduct.batchNo === product.batchNo &&
//             (
//                 (existingProduct.startSerialNo === product.startSerialNo && 
//                  existingProduct.endSerialNo === product.endSerialNo) ||
//                 // check for overlap
//                 (
//                     product.startSerialNo >= existingProduct.startSerialNo && 
//                     product.startSerialNo <= existingProduct.endSerialNo
//                 ) ||
//                 (
//                     product.endSerialNo >= existingProduct.startSerialNo && 
//                     product.endSerialNo <= existingProduct.endSerialNo
//                 )
//             );
//     });
        
//     // Calculate the units for the new product
//     const newUnitsUsed = product.endSerialNo - product.startSerialNo + 1;
    
//     // If this is an update, we need to add back the original units before checking
//     let adjustedRemainingUnits = remainingUnits;
    
//     if (existingProductIndex !== -1) {
//         // Get the existing product
//         const existingProduct = products[existingProductIndex];
        
//         // Calculate how many units the existing product was using
//         const existingUnitsUsed = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
        
//         // Add those units back to get the true remaining units before this update
//         adjustedRemainingUnits += existingUnitsUsed;
//     }
    
//     // Now check if there are enough units for the new/updated product
//     if (newUnitsUsed > adjustedRemainingUnits) {
//         alert(`Not enough units! Only ${adjustedRemainingUnits} units available.`);
//         return;
//     }

//     // Update or add the product
//     if (existingProductIndex !== -1) {
//         const updatedProducts = [...products];
//         updatedProducts[existingProductIndex] = product;
        
//         setProducts(updatedProducts);
//         localStorage.setItem("products", JSON.stringify(updatedProducts));
        
//         // Update remaining units
//         // First add back the original units, then subtract the new ones
//         const existingProduct = products[existingProductIndex];
//         const existingUnitsUsed = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
        
//         const newRemainingUnits = remainingUnits + existingUnitsUsed - newUnitsUsed;
//         setRemainingUnits(newRemainingUnits);
//         localStorage.setItem("remainingUnits", newRemainingUnits.toString());
//     } else {
//         // It's a new product
//         const updatedProducts = [...products, product];
//         setProducts(updatedProducts);
//         localStorage.setItem("products", JSON.stringify(updatedProducts));
        
//         // Update remaining units for new product
//         const newRemainingUnits = remainingUnits - newUnitsUsed;
//         setRemainingUnits(newRemainingUnits);
//         localStorage.setItem("remainingUnits", newRemainingUnits.toString());
        
//         // Only update lastUsedSerialNo if there are still units remaining
//         if (newRemainingUnits > 0) {
//             setLastUsedSerialNo(product.endSerialNo + 1);
//             localStorage.setItem("lastUsedSerialNo", (product.endSerialNo + 1).toString());
//         }
//     }
    
//     setSelectedProduct(null);
// };

//     // Cancel editing
//     const handleCancel = () => setSelectedProduct(null);

//     // Delete product from state and localStorage
//     const handleDelete = (productToDelete) => {
//         const deletedUnits = productToDelete.endSerialNo - productToDelete.startSerialNo + 1;
//         const updatedProducts = products.filter((p) =>
//             //here the product name and batch no should come too
//             !(p.name === productToDelete.name &&
//                 p.batchNo === productToDelete.batchNo &&
//                 p.startSerialNo === productToDelete.startSerialNo &&
//                 p.endSerialNo === productToDelete.endSerialNo
//             ));
//         setProducts(updatedProducts);
//         localStorage.setItem("products", JSON.stringify(updatedProducts));
        
//         //update the no of remaining units based on this
//         const newRemainingUnits = remainingUnits + deletedUnits;
//         setRemainingUnits(newRemainingUnits);
//         localStorage.setItem("remainingUnits", newRemainingUnits.toString());
//         let newSerialNo = 1; // Default if nothing found
    
//         if (updatedProducts.length > 0) {
//             // Sort products by serial number
//             const sortedProducts = [...updatedProducts].sort((a, b) => a.startSerialNo - b.startSerialNo);
            
//             // Find the first gap in serial numbers
//             for (let i = 0; i < sortedProducts.length; i++) {
//                 if (i === 0 && sortedProducts[i].startSerialNo > 1) {
//                     // Gap at the beginning
//                     newSerialNo = 1;
//                     break;
//                 }
                
//                 if (i < sortedProducts.length - 1) {
//                     // Check for gap between current product's end and next product's start
//                     if (sortedProducts[i].endSerialNo + 1 < sortedProducts[i+1].startSerialNo) {
//                         newSerialNo = sortedProducts[i].endSerialNo + 1;
//                         break;
//                     }
//                 } else {
//                     // If we reach the last product with no gaps, use the end + 1
//                     newSerialNo = sortedProducts[i].endSerialNo + 1;
//                 }
//             }
//         }
        
//         setLastUsedSerialNo(newSerialNo);
//         localStorage.setItem("lastUsedSerialNo", newSerialNo.toString());
        
//         // Deselect the product
//         setSelectedProduct(null);
//     };

//     // Submit all products
//     const submitAllProducts = async () => {
//         if (products.length === 0) {
//             setError("No products to submit.");
//             return;
//         }

//         if (!confirm("Are you sure you want to submit all products?")) {
//             return;
//         }

//         setIsSubmitting(true);
//         setError(null);
//         setSuccess(false);
    
//         try {
//             const response = await fetch("/api/products", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ products: products }),
//             });
    
//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to submit products');
//             }
            
//             localStorage.removeItem("products");
//             localStorage.removeItem("remainingUnits");
//             localStorage.removeItem("lastUsedSerialNo");

//             setProducts([]);
//             setRemainingUnits(0);
//             setLastUsedSerialNo(1);
//             setSuccess(true);
//         } catch (error) {
//             console.error("Error submitting products:", error);
//             setError(error.message || "Failed to submit products. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="flex flex-col bg-blue-900/30 backdrop-blur-lg p-2 rounded-md border-blue-400/20">
//             {/* Header */}
//             <div className="w-full flex gap-2 m-2">
//                 <TableProperties className="text-white bg-none" size={32}/>
//                 <h1 className="text-2xl font-semibold text-white">Product Registration</h1>
//                 {remainingUnits <= 0 && (
//                     <div className="ml-auto px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
//                         Task Completed
//                     </div>
//                 )}
//             </div>
            
//             {/* Main Section */}
//             <div className="grid grid-cols-3 gap-2 p-6 space-y-6 w-full">
//                 {/* Product Form */}
//                 <ProductForm 
//                     onSave={handleSaveProduct} 
//                     selectedProduct={selectedProduct} 
//                     onCancel={handleCancel} 
//                     onDelete={handleDelete} 
//                     taskId={taskId}
//                     role={role}
//                     remainingUnits={remainingUnits}
//                     setRemainingUnits={setRemainingUnits}
//                     lastUsedSerialNo={lastUsedSerialNo}
//                     setLastUsedSerialNo={setLastUsedSerialNo}
//                 />
                
//                 {/* Table */}
//                 <div className="col-span-2 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
//                     <div className="flex justify-between items-center mb-3">
//                         <h2 className="text-xl font-semibold">Product List</h2>
//                         <div className="text-sm bg-blue-800/50 px-3 py-1 rounded-full">
//                             Remaining Units: <span className="font-bold">{remainingUnits}</span>
//                         </div>
//                     </div>
//                     <table className="w-full text-left">
//                         <thead className="border-b border-blue-400/20">
//                             <tr>
//                                 <th className="p-2">Name</th>
//                                 <th className="p-2">Batch No</th>
//                                 <th className="p-2">No of units created</th>
//                                 <th className="p-2">Start Serial</th>
//                                 <th className="p-2">End Serial</th>
//                                 <th className="p-2">Date</th>
//                                 <th className="p-2">Location</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {products.map((product, index) => (
//                                 <tr 
//                                     key={index} 
//                                     onClick={() => setSelectedProduct(product)} 
//                                     className="cursor-pointer hover:bg-blue-500/20 transition"
//                                 >
//                                     <td className="p-2">{product.name}</td>
//                                     <td className="p-2">{product.batchNo}</td>
//                                     <td className="p-2">{product.endSerialNo - product.startSerialNo + 1}</td>
//                                     <td className="p-2">{product.startSerialNo}</td>
//                                     <td className="p-2">{product.endSerialNo}</td>
//                                     <td className="p-2">{new Date(product.date).toLocaleDateString()}</td>
//                                     <td className="p-2">{product.location}</td>
//                                 </tr>
//                             ))}
//                             {products.length === 0 && (
//                                 <tr>
//                                     <td colSpan="7" className="p-4 text-center text-gray-400">
//                                         No products created yet
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Error Notification */}
//                 {error && (
//                     <div className="col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                         {error}
//                     </div>
//                 )}

//                 {/* Success Notification */}
//                 {success && (
//                     <div className="col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//                         Products submitted successfully!
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <Button 
//                     onClick={submitAllProducts}
//                     className="bg-blue-600 text-white col-span-3"
//                     disabled={isSubmitting || products.length === 0}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit All Products'}
//                 </Button>
//             </div>
//         </div>
//     );
// }

// "use client";

// import ProductForm from "./ProductForm.jsx";
// import { useState, useEffect } from "react";
// import { TableProperties } from "lucide-react";
// import { Button } from "./ui/button.jsx";

// export default function ProductRegistration({taskId, role}) {
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);
//     const [remainingUnits, setRemainingUnits] = useState(0);
//     const [totalUnits, setTotalUnits] = useState(0);
//     const [lastUsedSerialNo, setLastUsedSerialNo] = useState(1);
//     const [taskData,setTaskData]=useState(null);
  
    
//     useEffect(() => {
//         // This could be fetched from backend or localStorage
//         const loadInitialState = async () => {
//             try {
//                 // Fetch task details or use localStorage
//                 const storedProducts = localStorage.getItem("products");
//                 console.log("The stored products in localStorage is", storedProducts);
                
//                 const storedTotalUnits = localStorage.getItem("totalUnits");
//                 const storedRemainingUnits = localStorage.getItem("remainingUnits");
//                 console.log("The stored remaining units in local Storage is", storedRemainingUnits);
                
//                 const storedLastSerialNo = localStorage.getItem("lastUsedSerialNo");
//                 console.log("The stored last serial no in local Storage is", storedLastSerialNo);
                
//                 if (storedProducts) {
//                     const parsedProducts = JSON.parse(storedProducts);
//                     setProducts(parsedProducts);

//                     // Calculate last used serial number
//                     const maxEndSerialNo = parsedProducts.reduce((max, product) => 
//                         Math.max(max, product.endSerialNo), 0);
//                     setLastUsedSerialNo(maxEndSerialNo + 1);
//                 }

//                 if (storedTotalUnits) setTotalUnits(Number(storedTotalUnits));
                
//                 // Check if there are remaining units
//                 if (storedRemainingUnits) {
//                     const remainingUnitsValue = Number(storedRemainingUnits);
//                     setRemainingUnits(remainingUnitsValue);
                    
//                     // If no remaining units, don't update lastUsedSerialNo
//                     if (remainingUnitsValue <= 0 && storedLastSerialNo) {
//                         setLastUsedSerialNo(Number(storedLastSerialNo));
//                     } else if (storedLastSerialNo) {
//                         setLastUsedSerialNo(Number(storedLastSerialNo));
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error loading initial state:", error);
//             }
//         };
//         const fetchTaskData = async () => {
//             if (role === "lineManager" && taskId) {
//                 setLoading(true);
//                 try {
//                     const response = await axios.get('/api/lineManagers/fetch-assigned-task');
                    
//                     if (response.data.success) {
//                         // Find the specific task with matching taskId
//                         const task = response.data.tasks.find(t => t._id === taskId);
//                         console.log("The task data is",task);
                        
//                         if (task) {
//                             setTaskData(task);
                            
//                             // Pre-populate form with task data
                           
//                            }
//                           else {
//                             toast({
//                                 title: "Task not found",
//                                 description: "Could not find the specified task",
//                                 variant: 'destructive',
//                                 duration: 5000,
//                             });
//                         }
//                     } else {
//                         toast({
//                             title: "Failed to fetch tasks",
//                             description: response.data.message || "An error occurred",
//                             variant: 'destructive',
//                             duration: 5000,
//                         });
//                     }
//                 } catch (error) {
//                     console.error("Error:", error);
//                     toast({
//                         title: "Failed to find tasks",
//                         description: error.response?.data?.message || "An error occurred while fetching line tasks",
//                         variant: 'destructive',
//                         duration: 5000,
//                     });
//                 } finally {
//                     setLoading(false);
//                 }
//             } else {
//                 setLoading(false);
//             }
//         };
        
//         fetchTaskData();
//         loadInitialState();

//     }, []);

//     // Save or update product in state and localStorage
//     const handleSaveProduct = (product) => {
//         // Add timestamp to the product if it doesn't exist
//         if (!product.timestamp) {
//             product.timestamp = new Date().toISOString();
//         }
        
//         // First, check if this is an update to an existing product
//         const existingProductIndex = products.findIndex(existingProduct => {
//             return existingProduct.name === product.name &&
//                 existingProduct.batchNo === product.batchNo &&
//                 (
//                     (existingProduct.startSerialNo === product.startSerialNo && 
//                      existingProduct.endSerialNo === product.endSerialNo) ||
//                     // check for overlap
//                     (
//                         product.startSerialNo >= existingProduct.startSerialNo && 
//                         product.startSerialNo <= existingProduct.endSerialNo
//                     ) ||
//                     (
//                         product.endSerialNo >= existingProduct.startSerialNo && 
//                         product.endSerialNo <= existingProduct.endSerialNo
//                     )
//                 );
//         });
            
//         // Calculate the units for the new product
//         const newUnitsUsed = product.endSerialNo - product.startSerialNo + 1;
        
//         // If this is an update, we need to add back the original units before checking
//         let adjustedRemainingUnits = remainingUnits;
        
//         if (existingProductIndex !== -1) {
//             // Get the existing product
//             const existingProduct = products[existingProductIndex];
            
//             // Calculate how many units the existing product was using
//             const existingUnitsUsed = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
            
//             // Add those units back to get the true remaining units before this update
//             adjustedRemainingUnits += existingUnitsUsed;
            
//             // Preserve original timestamp for updates
//             product.timestamp = existingProduct.timestamp;
//         }
        
//         // Now check if there are enough units for the new/updated product
//         if (newUnitsUsed > adjustedRemainingUnits) {
//             alert(`Not enough units! Only ${adjustedRemainingUnits} units available.`);
//             return;
//         }

//         // Update or add the product
//         if (existingProductIndex !== -1) {
//             const updatedProducts = [...products];
//             updatedProducts[existingProductIndex] = product;
            
//             setProducts(updatedProducts);
//             localStorage.setItem("products", JSON.stringify(updatedProducts));
            
//             // Update remaining units
//             // First add back the original units, then subtract the new ones
//             const existingProduct = products[existingProductIndex];
//             const existingUnitsUsed = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
            
//             const newRemainingUnits = remainingUnits + existingUnitsUsed - newUnitsUsed;
//             setRemainingUnits(newRemainingUnits);
//             localStorage.setItem("remainingUnits", newRemainingUnits.toString());
//         } else {
//             // It's a new product
//             const updatedProducts = [...products, product];
//             setProducts(updatedProducts);
//             localStorage.setItem("products", JSON.stringify(updatedProducts));
            
//             // Update remaining units for new product
//             const newRemainingUnits = remainingUnits - newUnitsUsed;
//             setRemainingUnits(newRemainingUnits);
//             localStorage.setItem("remainingUnits", newRemainingUnits.toString());
            
//             // Only update lastUsedSerialNo if there are still units remaining
//             if (newRemainingUnits > 0) {
//                 setLastUsedSerialNo(product.endSerialNo + 1);
//                 localStorage.setItem("lastUsedSerialNo", (product.endSerialNo + 1).toString());
//             }
//         }
        
//         setSelectedProduct(null);
//     };

//     // Cancel editing
//     const handleCancel = () => setSelectedProduct(null);

//     // Delete product from state and localStorage
//     const handleDelete = (productToDelete) => {
//         const deletedUnits = productToDelete.endSerialNo - productToDelete.startSerialNo + 1;
//         const updatedProducts = products.filter((p) =>
//             //here the product name and batch no should come too
//             !(p.name === productToDelete.name &&
//                 p.batchNo === productToDelete.batchNo &&
//                 p.startSerialNo === productToDelete.startSerialNo &&
//                 p.endSerialNo === productToDelete.endSerialNo
//             ));
//         setProducts(updatedProducts);
//         localStorage.setItem("products", JSON.stringify(updatedProducts));
        
//         //update the no of remaining units based on this
//         const newRemainingUnits = remainingUnits + deletedUnits;
//         setRemainingUnits(newRemainingUnits);
//         localStorage.setItem("remainingUnits", newRemainingUnits.toString());
//         let newSerialNo = 1; // Default if nothing found
    
//         if (updatedProducts.length > 0) {
//             // Sort products by serial number
//             const sortedProducts = [...updatedProducts].sort((a, b) => a.startSerialNo - b.startSerialNo);
            
//             // Find the first gap in serial numbers
//             for (let i = 0; i < sortedProducts.length; i++) {
//                 if (i === 0 && sortedProducts[i].startSerialNo > 1) {
//                     // Gap at the beginning
//                     newSerialNo = 1;
//                     break;
//                 }
                
//                 if (i < sortedProducts.length - 1) {
//                     // Check for gap between current product's end and next product's start
//                     if (sortedProducts[i].endSerialNo + 1 < sortedProducts[i+1].startSerialNo) {
//                         newSerialNo = sortedProducts[i].endSerialNo + 1;
//                         break;
//                     }
//                 } else {
//                     // If we reach the last product with no gaps, use the end + 1
//                     newSerialNo = sortedProducts[i].endSerialNo + 1;
//                 }
//             }
//         }
        
//         setLastUsedSerialNo(newSerialNo);
//         localStorage.setItem("lastUsedSerialNo", newSerialNo.toString());
        
//         // Deselect the product
//         setSelectedProduct(null);
//     };

//     // Submit all products
//     const submitAllProducts = async () => {
//         if (products.length === 0) {
//             setError("No products to submit.");
//             return;
//         }

//         if (!confirm("Are you sure you want to submit all products?")) {
//             return;
//         }

//         setIsSubmitting(true);
//         setError(null);
//         setSuccess(false);
    
//         try {
//             const response = await fetch("/api/products", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ products: products }),
//             });
    
//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to submit products');
//             }
            
//             localStorage.removeItem("products");
//             localStorage.removeItem("remainingUnits");
//             localStorage.removeItem("lastUsedSerialNo");

//             setProducts([]);
//             setRemainingUnits(0);
//             setLastUsedSerialNo(1);
//             setSuccess(true);
//         } catch (error) {
//             console.error("Error submitting products:", error);
//             setError(error.message || "Failed to submit products. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Format timestamp to a readable format
//     const formatTimestamp = (timestamp) => {
//         if (!timestamp) return "N/A";
//         const date = new Date(timestamp);
//         return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//     };

//     return (
//         <div className="flex flex-col bg-blue-900/30 backdrop-blur-lg p-2 rounded-md border-blue-400/20">
//             {/* Header */}
//             <div className="w-full flex gap-2 m-2">
//                 <TableProperties className="text-white bg-none" size={32}/>
//                 <h1 className="text-2xl font-semibold text-white">Product Registration</h1>
//                 <table>
//                     <thead>
//                         <tr>
//                             <td>Task Id:{taskData.name}</td>
//                             <td>Manufacturer Name:</td>
//                             <td>Location:{taskData.location}</td>
//                             <td>Status:{taskData.status}</td>
//                             <td>Assigned At:{taskData.assignedAt}</td>
//                         </tr>
//                     </thead>
//                 </table>
//                 {remainingUnits <= 0 && (
//                     <div className="ml-auto px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
//                         Task Completed
//                     </div>
//                 )}
//             </div>
            
//             {/* Main Section */}
//             <div className="grid grid-cols-3 gap-2 p-6 space-y-6 w-full">
//                 {/* Product Form */}
//                 <ProductForm 
//                     onSave={handleSaveProduct} 
//                     selectedProduct={selectedProduct} 
//                     onCancel={handleCancel} 
//                     onDelete={handleDelete} 
//                     taskId={taskId}
//                     role={role}
//                     remainingUnits={remainingUnits}
//                     setRemainingUnits={setRemainingUnits}
//                     lastUsedSerialNo={lastUsedSerialNo}
//                     setLastUsedSerialNo={setLastUsedSerialNo}
//                 />
                
//                 {/* Table */}
//                 <div className="col-span-2 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
//                     <div className="flex justify-between items-center mb-3">
//                         <h2 className="text-xl font-semibold">Product List</h2>
//                         <div className="text-sm bg-blue-800/50 px-3 py-1 rounded-full">
//                             Remaining Units: <span className="font-bold">{remainingUnits}</span>
//                         </div>
//                     </div>
//                     <table className="w-full text-left">
//                         <thead className="border-b border-blue-400/20">
//                             <tr>
//                                 <th className="p-2">Name</th>
//                                 <th className="p-2">Batch No</th>
//                                 <th className="p-2">No of units created</th>
//                                 <th className="p-2">Start Serial</th>
//                                 <th className="p-2">End Serial</th>
//                                 <th className="p-2">Date</th>
//                                 <th className="p-2">Location</th>
//                                 <th className="p-2">Timestamp</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {products.map((product, index) => (
//                                 <tr 
//                                     key={index} 
//                                     onClick={() => setSelectedProduct(product)} 
//                                     className="cursor-pointer hover:bg-blue-500/20 transition"
//                                 >
//                                     <td className="p-2">{product.name}</td>
//                                     <td className="p-2">{product.batchNo}</td>
//                                     <td className="p-2">{product.endSerialNo - product.startSerialNo + 1}</td>
//                                     <td className="p-2">{product.startSerialNo}</td>
//                                     <td className="p-2">{product.endSerialNo}</td>
//                                     <td className="p-2">{new Date(product.date).toLocaleDateString()}</td>
//                                     <td className="p-2">{product.location}</td>
//                                     <td className="p-2">{formatTimestamp(product.timestamp)}</td>
//                                 </tr>
//                             ))}
//                             {products.length === 0 && (
//                                 <tr>
//                                     <td colSpan="8" className="p-4 text-center text-gray-400">
//                                         No products created yet
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Error Notification */}
//                 {error && (
//                     <div className="col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                         {error}
//                     </div>
//                 )}

//                 {/* Success Notification */}
//                 {success && (
//                     <div className="col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//                         Products submitted successfully!
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <Button 
//                     onClick={submitAllProducts}
//                     className="bg-blue-600 text-white col-span-3"
//                     disabled={isSubmitting || products.length === 0}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit All Products'}
//                 </Button>
//             </div>
//         </div>
//     );
// }

"use client";

import ProductForm from "./ProductForm.jsx";
import { useState, useEffect } from "react";
import { TableProperties } from "lucide-react";
import { Button } from "./ui/button.jsx";
import axios from "axios"; // Added missing import
import { useToast } from "../hooks/useToast";

export default function ProductRegistration({taskId, role}) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [remainingUnits, setRemainingUnits] = useState(0);
    const [totalUnits, setTotalUnits] = useState(0);
    const [lastUsedSerialNo, setLastUsedSerialNo] = useState(1);
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(false); // Added missing state
    const [manufacturerName,setManufacturerName]=useState("");
  const toast=useToast();
    
    useEffect(() => {
        // This could be fetched from backend or localStorage
        const loadInitialState = async () => {
            try {
                // Fetch task details or use localStorage
                const storedProducts = localStorage.getItem("products");
                console.log("The stored products in localStorage is", storedProducts);
                
                const storedTotalUnits = localStorage.getItem("totalUnits");
                const storedRemainingUnits = localStorage.getItem("remainingUnits");
                console.log("The stored remaining units in local Storage is", storedRemainingUnits);
                
                const storedLastSerialNo = localStorage.getItem("lastUsedSerialNo");
                console.log("The stored last serial no in local Storage is", storedLastSerialNo);
                
                if (storedProducts) {
                    const parsedProducts = JSON.parse(storedProducts);
                    setProducts(parsedProducts);

                    // Calculate last used serial number
                    const maxEndSerialNo = parsedProducts.reduce((max, product) => 
                        Math.max(max, product.endSerialNo), 0);
                    setLastUsedSerialNo(maxEndSerialNo + 1);
                }

                if (storedTotalUnits) setTotalUnits(Number(storedTotalUnits));
                
                // Check if there are remaining units
                if (storedRemainingUnits) {
                    const remainingUnitsValue = Number(storedRemainingUnits);
                    setRemainingUnits(remainingUnitsValue);
                    
                    // If no remaining units, don't update lastUsedSerialNo
                    if (remainingUnitsValue <= 0 && storedLastSerialNo) {
                        setLastUsedSerialNo(Number(storedLastSerialNo));
                    } else if (storedLastSerialNo) {
                        setLastUsedSerialNo(Number(storedLastSerialNo));
                    }
                }
            } catch (error) {
                console.error("Error loading initial state:", error);
            }
        };
        const fetchTaskData = async () => {
            if (role === "lineManager" && taskId) {
                setLoading(true);
                try {
                    const response = await axios.get('/api/lineManagers/fetch-assigned-task');
                    
                    if (response.data.success) {
                        // Find the specific task with matching taskId
                        const task = response.data.tasks.find(t => t._id === taskId);
                        console.log("The task data is", task);
                        
                        if (task) {
                           console.log("The task is",task);
                           
                            setTaskData(task);
                            if (task.manufacturer) {
                                try {
                                    const manufacturerResponse = await axios.get(`/api/manufacturers/getById?id=${task.manufacturer}`);
                                    if (manufacturerResponse.data.success) {
                                        setManufacturerName(manufacturerResponse.data.manufacturer.name);
                                    }
                                } catch (manufacturerError) {
                                    console.error("Error fetching manufacturer:", manufacturerError);
                                    setManufacturerName("Error fetching name");
                                }
                            // Pre-populate form with task data
                            }  
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
        loadInitialState();

    }, [taskId, role]);

    // Save or update product in state and localStorage
    const handleSaveProduct = (product) => {
        // Add timestamp to the product if it doesn't exist
        if (!product.timestamp) {
            product.timestamp = new Date().toISOString();
        }
        
        // First, check if this is an update to an existing product
        const existingProductIndex = products.findIndex(existingProduct => {
            return existingProduct.name === product.name &&
                existingProduct.batchNo === product.batchNo &&
                (
                    (existingProduct.startSerialNo === product.startSerialNo && 
                     existingProduct.endSerialNo === product.endSerialNo) ||
                    // check for overlap
                    (
                        product.startSerialNo >= existingProduct.startSerialNo && 
                        product.startSerialNo <= existingProduct.endSerialNo
                    ) ||
                    (
                        product.endSerialNo >= existingProduct.startSerialNo && 
                        product.endSerialNo <= existingProduct.endSerialNo
                    )
                );
        });
            
        // Calculate the units for the new product
        const newUnitsUsed = product.endSerialNo - product.startSerialNo + 1;
        
        // If this is an update, we need to add back the original units before checking
        let adjustedRemainingUnits = remainingUnits;
        
        if (existingProductIndex !== -1) {
            // Get the existing product
            const existingProduct = products[existingProductIndex];
            
            // Calculate how many units the existing product was using
            const existingUnitsUsed = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
            
            // Add those units back to get the true remaining units before this update
            adjustedRemainingUnits += existingUnitsUsed;
            
            // Preserve original timestamp for updates
            product.timestamp = existingProduct.timestamp;
        }
        
        // Now check if there are enough units for the new/updated product
        if (newUnitsUsed > adjustedRemainingUnits) {
            alert(`Not enough units! Only ${adjustedRemainingUnits} units available.`);
            return;
        }

        // Update or add the product
        if (existingProductIndex !== -1) {
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = product;
            
            setProducts(updatedProducts);
            localStorage.setItem("products", JSON.stringify(updatedProducts));
            
            // Update remaining units
            // First add back the original units, then subtract the new ones
            const existingProduct = products[existingProductIndex];
            const existingUnitsUsed = existingProduct.endSerialNo - existingProduct.startSerialNo + 1;
            
            const newRemainingUnits = remainingUnits + existingUnitsUsed - newUnitsUsed;
            setRemainingUnits(newRemainingUnits);
            localStorage.setItem("remainingUnits", newRemainingUnits.toString());
        } else {
            // It's a new product
            const updatedProducts = [...products, product];
            setProducts(updatedProducts);
            localStorage.setItem("products", JSON.stringify(updatedProducts));
            
            // Update remaining units for new product
            const newRemainingUnits = remainingUnits - newUnitsUsed;
            setRemainingUnits(newRemainingUnits);
            localStorage.setItem("remainingUnits", newRemainingUnits.toString());
            
            // Only update lastUsedSerialNo if there are still units remaining
            if (newRemainingUnits > 0) {
                setLastUsedSerialNo(product.endSerialNo + 1);
                localStorage.setItem("lastUsedSerialNo", (product.endSerialNo + 1).toString());
            }
        }
        
        setSelectedProduct(null);
    };

    // Cancel editing
    const handleCancel = () => setSelectedProduct(null);

    // Delete product from state and localStorage
    const handleDelete = (productToDelete) => {
        const deletedUnits = productToDelete.endSerialNo - productToDelete.startSerialNo + 1;
        const updatedProducts = products.filter((p) =>
            //here the product name and batch no should come too
            !(p.name === productToDelete.name &&
                p.batchNo === productToDelete.batchNo &&
                p.startSerialNo === productToDelete.startSerialNo &&
                p.endSerialNo === productToDelete.endSerialNo
            ));
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        
        //update the no of remaining units based on this
        const newRemainingUnits = remainingUnits + deletedUnits;
        setRemainingUnits(newRemainingUnits);
        localStorage.setItem("remainingUnits", newRemainingUnits.toString());
        let newSerialNo = 1; // Default if nothing found
    
        if (updatedProducts.length > 0) {
            // Sort products by serial number
            const sortedProducts = [...updatedProducts].sort((a, b) => a.startSerialNo - b.startSerialNo);
            
            // Find the first gap in serial numbers
            for (let i = 0; i < sortedProducts.length; i++) {
                if (i === 0 && sortedProducts[i].startSerialNo > 1) {
                    // Gap at the beginning
                    newSerialNo = 1;
                    break;
                }
                
                if (i < sortedProducts.length - 1) {
                    // Check for gap between current product's end and next product's start
                    if (sortedProducts[i].endSerialNo + 1 < sortedProducts[i+1].startSerialNo) {
                        newSerialNo = sortedProducts[i].endSerialNo + 1;
                        break;
                    }
                } else {
                    // If we reach the last product with no gaps, use the end + 1
                    newSerialNo = sortedProducts[i].endSerialNo + 1;
                }
            }
        }
        
        setLastUsedSerialNo(newSerialNo);
        localStorage.setItem("lastUsedSerialNo", newSerialNo.toString());
        
        // Deselect the product
        setSelectedProduct(null);
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
            console.log("The atsk id is n rontend",taskId);
            
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ products: products,taskId:taskId }),
                
                
            });
    
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit products');
            }
            
            localStorage.removeItem("products");
            localStorage.removeItem("remainingUnits");
            localStorage.removeItem("lastUsedSerialNo");

            setProducts([]);
            setRemainingUnits(0);
            setLastUsedSerialNo(1);
            setSuccess(true);
        } catch (error) {
            console.error("Error submitting products:", error);
            setError(error.message || "Failed to submit products. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format timestamp to a readable format
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    // Format date for task details
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="flex flex-col bg-blue-900/30 backdrop-blur-lg p-2 rounded-md border-blue-400/20">
            {/* Header */}
            <div className="w-full flex items-center gap-2 m-2">
                <TableProperties className="text-white bg-none" size={32}/>
                <h1 className="text-2xl font-semibold text-white">Product Registration</h1>
                {remainingUnits <= 0 && (
                    <div className="ml-auto px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                        Task Completed
                    </div>
                )}
            </div>
            
            {/* Task Details */}
            {taskData && (
                <div className="mb-4 p-4 bg-blue-800/30 rounded-lg border border-blue-400/20">
                    <h2 className="text-lg font-semibold text-white mb-2">Task Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-sm">Task ID</span>
                            <span className="font-medium">{taskData._id || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-sm">Manufacturerr</span>
                            <span className="font-medium">{manufacturerName || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-sm">Location</span>
                            <span className="font-medium">{taskData.location || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-sm">Status</span>
                            <span className="font-medium">{taskData.status || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-sm">Assigned At</span>
                            <span className="font-medium">{formatDate(taskData.assignedAt)}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {loading && (
                <div className="text-center py-4 text-white">Loading task details...</div>
            )}
            
            {/* Main Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-6 space-y-6 w-full">
                {/* Product Form */}
                <ProductForm 
                    onSave={handleSaveProduct} 
                    selectedProduct={selectedProduct} 
                    onCancel={handleCancel} 
                    onDelete={handleDelete} 
                    taskId={taskId}
                    role={role}
                    remainingUnits={remainingUnits}
                    setRemainingUnits={setRemainingUnits}
                    lastUsedSerialNo={lastUsedSerialNo}
                    setLastUsedSerialNo={setLastUsedSerialNo}
                />
                
                {/* Table */}
                <div className="col-span-1 md:col-span-2 bg-blue-900/30 p-4 rounded-lg shadow-lg border border-blue-400/20 hover:shadow-xl transition-all text-white">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-semibold">Product List</h2>
                        <div className="text-sm bg-blue-800/50 px-3 py-1 rounded-full">
                            Remaining Units: <span className="font-bold">{remainingUnits}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-blue-400/20">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Batch No</th>
                                    <th className="p-2">Units</th>
                                    <th className="p-2">Start Serial</th>
                                    <th className="p-2">End Serial</th>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Location</th>
                                    <th className="p-2">Timestamp</th>
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
                                        <td className="p-2">{product.location}</td>
                                        <td className="p-2">{formatTimestamp(product.timestamp)}</td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="p-4 text-center text-gray-400">
                                            No products created yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Error Notification */}
                {error && (
                    <div className="col-span-1 md:col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Success Notification */}
                {success && (
                    <div className="col-span-1 md:col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        Products submitted successfully!
                    </div>
                )}

                {/* Submit Button */}
                <Button 
                    onClick={submitAllProducts}
                    className="bg-blue-600 text-white col-span-1 md:col-span-3"
                    disabled={isSubmitting || products.length === 0}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit All Products'}
                </Button>
            </div>
        </div>
    );
}