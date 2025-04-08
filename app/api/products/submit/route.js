// import crypto from "crypto";
// import path from "path";
// import { NextResponse } from "next/server";
// import {dbConnect} from "../../../lib/dbConnect";
// import Product from "../../../model/Product";
// import { writeFile } from "fs/promises";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/option";

// await dbConnect();
// const session=getServerSession(authOptions);
// if (!session || !session.user || !session.user._id) {

//     return NextResponse.json(
//         { success: false, message: "Not Authenticated or user ID missing" },
//         { status: 400 }
//     );

// }

// const generateHash = (input) => 
//     crypto.createHash("sha256").update(input).digest("hex");

// export async function GET() {
//     try {
//         const response = NextResponse.json(
//             { success: true, message: "Processing in background" }, 
//             { status: 202 }
//         );

//         setTimeout(async () => {
//             try {
//                 const today = new Date();
//                 today.setUTCHours(0, 0, 0, 0);

//                 const products = await Product.find(
//                     { 
//                         createdAt: { $gte: today },
//                         hashGenerated: { $ne: true }
//                     },
//                     "_id name location date batchNo serialNo amount"
//                 );

//                 console.log("Products found: ", products);

//                 const allUnits = await Promise.all(
//                     products.map(async (product) => {
//                         const { _id, name, location, date, batchNo, startSerialNo,endSerialNo, NoOfUnits } = product;

//                         const unitIds = Array.from({ length: amount }, (_, i) =>
//                             `${_id.toString()}${generateHash(`${name}-${location}-${date}-${batchNo}-${Number(startSerialNo) + i}`)}`
//                         );

//                         const filePath = path.join(process.cwd(), "data.txt");
//                         await writeFile(filePath, JSON.stringify(unitIds, null, 2));

//                         await Product.updateOne(
//                             { _id },
//                             { $set: { hashGenerated: true } }
//                         );

//                         return { productId: _id, unitIds };
//                     })
//                 );

//                 console.log("Generated unit IDs successfully", allUnits);
//             } catch (error) {
//                 console.error("Error generating unit IDs:", error);
//             }
//         }, 2000);

//         return response;
//     } catch (error) {
//         console.error("Error initializing background process:", error);
//         return NextResponse.json({ error: "Internal Server Error" });
//     }
// }

// export async function POST(request) {
//     try {
//         const body = await request.json();
//         const productsList = body.products;

//         if (!Array.isArray(productsList) || productsList.length === 0) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid product list" },
//                 { status: 400 }
//             );
//         }

//         const result = await Product.insertMany(
//             productsList.map((product) => ({
//                 ...product,
//                 hashGenerated: false
//             }))
//         );

//         return NextResponse.json(
//             { success: true, data: result },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("API Error:", error);
//         return NextResponse.json(
//             { success: false, message: error.message },
//             { status: 500 }
//         );
//     }
// }

// import { NextResponse } from "next/server";
// import { dbConnect } from "../../../lib/dbConnect";
// import Product from "../../../model/Product";
// import Batch from "../../../model/Batch";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/option";
// import Manufacturer from '../../../model/Manufacturer';
// export async function POST(request){
//     try {
//         await dbConnect();
//         const session =await getServerSession(authOptions);
//         if(!session || !session.user || !session.user._id){
//             return NextResponse.json(
//                 { success: false, message: "Not authenticated" },
//                 { status: 401 }
//             )
//         }
//         const userId = session.user._id;
//         const userRole = session.user.role; // Assuming role is stored in session
        
//         const body = await request.json();
//         const productsList = body.products;
//         if (!Array.isArray(productsList) || productsList.length === 0) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid product list" },
//                 { status: 400 }
//             );
//         }
//         const groupedProducts = {};
//         productsList.forEach(product => {
//             const key = `${product.name}-${product.location}`;
//             if (!groupedProducts[key]) {
//                 groupedProducts[key] = [];
//             }
//             groupedProducts[key].push(product);
//         });
//         const results = [];
        
//         // Process each unique product
//         for (const [key, products] of Object.entries(groupedProducts)) {
//             const [name, location] = key.split('-');
            
//             // Find or create the product
//             let product = await Product.findOne({ 
//                 name: name,
//                 location: location,
//                 manufacturerId: userRole === 'manufacturer' ? userId : products[0].manufacturerId
//             });
            
//             if (!product) {
//                 product = await Product.create({
//                     name: name,
//                     location: location,
//                     manufacturerId: userRole === 'manufacturer' ? userId : products[0].manufacturerId,
//                     batchIds: [],
//                     generatedHash: false
//                 });
//             }
            
//             // Process batches for this product
//             for (const productData of products) {
//                 const unitsCreated = productData.endSerialNo - productData.startSerialNo + 1;
//                 const timestamp = productData.timestamp || new Date().toISOString();
                
//                 // For manufacturers, each product entry becomes its own batch
//                 if (userRole === 'manufacturer') {
//                     const batch = await Batch.create({
//                         productId: product._id,
//                         batchNo: productData.batchNo,
//                         utcTimestamp: new Date(timestamp),
//                         totalUnits: unitsCreated,
//                         globalStartSerialNo: productData.startSerialNo,
//                         globalEndSerialNo: productData.endSerialNo
//                     });
                    
//                     // Update the product with the new batch ID
//                     product.batchIds.push(batch._id);
//                     await product.save();
                    
//                     results.push({
//                         productId: product._id,
//                         batchId: batch._id,
//                         units: unitsCreated
//                     });
//                 } 
//                 // For line managers, we need to handle batch merging and serialization
//                 else if (userRole === 'lineManager') {
//                     // Check if a batch with this batch number already exists for this product
//                     let batch = await Batch.findOne({
//                         productId: product._id,
//                         batchNo: productData.batchNo
//                     });
                    
//                     if (batch) {
//                         // Batch exists, add line manager data and update global serials
//                         const lineManagerEntry = {
//                             lineManagerId: userId,
//                             batchStartSerialNo: productData.startSerialNo,
//                             batchEndSerialNo: productData.endSerialNo,
//                             unitsCreated: unitsCreated,
//                             utcTimestamp: new Date(timestamp) // Store the line manager's timestamp
//                         };
                        
//                         // Add line manager to batch if not already present
//                         if (!batch.lineManagers) {
//                             batch.lineManagers = [];
//                         }
                        
//                         batch.lineManagers.push(lineManagerEntry);
                        
//                         // Update global serial numbers if needed
//                         batch.globalStartSerialNo = Math.min(batch.globalStartSerialNo, productData.startSerialNo);
//                         batch.globalEndSerialNo = Math.max(batch.globalEndSerialNo, productData.endSerialNo);
                        
//                         // Update total units
//                         batch.totalUnits += unitsCreated;
                        
//                         await batch.save();
//                     } else {
//                         // Create new batch with line manager data
//                         batch = await Batch.create({
//                             productId: product._id,
//                             batchNo: productData.batchNo,
//                             utcTimestamp: null, // For line manager batches, this should be null
//                             totalUnits: unitsCreated,
//                             globalStartSerialNo: productData.startSerialNo,
//                             globalEndSerialNo: productData.endSerialNo,
//                             lineManagers: [{
//                                 lineManagerId: userId,
//                                 batchStartSerialNo: productData.startSerialNo,
//                                 batchEndSerialNo: productData.endSerialNo,
//                                 unitsCreated: unitsCreated,
//                                 utcTimestamp: new Date(timestamp) // Store the timestamp with the line manager
//                             }]
//                         });
                        
//                         // Update the product with the new batch ID if not already included
//                         if (!product.batchIds.includes(batch._id)) {
//                             product.batchIds.push(batch._id);
//                             await product.save();
//                         }
//                     }
                    
//                     results.push({
//                         productId: product._id,
//                         batchId: batch._id,
//                         units: unitsCreated
//                     });
//                 }
//             }
//         }
        
//         return NextResponse.json(
//             { 
//                 success: true, 
//                 message: "Products and batches created successfully",
//                 data: results 
//             },
//             { status: 201 }
//         );

//     } catch (error) {
//         console.error("API Error:", error);
//         return NextResponse.json(
//             { success: false, message: error.message },
//             { status: 500 }
//         );
//     }
// }
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import Product from "../../../../model/Product";
import Batch from "../../../../model/Batch";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import Manufacturer from '../../../../model/Manufacturer';
import axios from 'axios';

const generateHash = (input) =>
    crypto.createHash("sha256").update(input).digest("hex");
  
export async function GET() {
    await dbConnect();
  
    try {
        const response = NextResponse.json(
            { success: true, message: "Processing in background" },
            { status: 202 }
        );
  
        setTimeout(async () => {
            try {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
        
                const productsWithBatches = await Product.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: today },
                            generatedHash: { $ne: true }
                        }
                    },
                    {
                        $lookup: {
                            from: "batches", // MongoDB collection name (usually lowercase plural of model)
                            localField: "_id",
                            foreignField: "productId",
                            as: "batches"
                        },
                        $lookup: {
                            from: "manufacturers",
                            localField: 'manufacturerId',
                            foreignField: '_id',
                            as: 'manufacturer'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            location: 1,
                            createdAt: 1,
                            batches: {
                                $map: {
                                    input: "$batches",
                                    as: "batch",
                                    in: {
                                        batchNo: "$$batch.batchNo",
                                        startSerialNo: "$$batch.globalStartSerialNo",
                                        endSerialNo: "$$batch.globalEndSerialNo"
                                    }
                                }
                            },
                            manufacturerDetails: {
                                $map: {
                                    input: '$manufacturer',
                                    as: 'manufacturer',
                                    in: {
                                        manuName: "$manufacturer.name",
                                        manuEmail: '$manufacturer.email',
                                        manuWebpage: "$manufacturer.website"
                                    }
                                }
                            }
                        },
                    }
                ]);
    
                if (!productsWithBatches.length) {
                    console.log("No products found for today.");
                    return;
                }

                console.log(productsWithBatches)
        
                const allUnits = [];
                const errorQRs = [];
        
                for (const product of productsWithBatches) {
                    const { _id, name, location, createdAt, batches } = product;
                    console.log("product", product)

        
                    for (const batch of batches) {
                        const { batchNo, startSerialNo, endSerialNo } = batch;
                        const totalUnits = endSerialNo - startSerialNo + 1;
            
                        const unitIds = Array.from({ length: totalUnits }, async (_, i) => {
                                const data = {
                                    product_name: `${name}`,
                                    batch_number: `${batchNo}`,
                                    location: `${location}`,
                                    date: `${createdAt.toISOString()}`,
                                    serial_number: String(startSerialNo + i),
                                    price: '2',
                                    weight: '12',
                                    man_name: 'qrcipher'
                                }
                                const productUrl = `https://qr-code-blockchain-1d-backend.onrender.com/products/${name}/${location}/${createdAt.toISOString()}/${batchNo}/${startSerialNo + i}`
                                const productHash = generateHash( `${_id.toString()}${generateHash(`${name}${location}${createdAt.toISOString()}${batchNo}${startSerialNo + i}`)}`)

                                const response = await fetch('https://qr-code-blockchain-1.vercel.app/api/contract_api', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                        ...data,
                                        url:productUrl,
                                        hashValue:productHash
                                    })
                                })
                                const result = response.json()

                                if (!result.success) {
                                    errorQRs.push({ url: productUrl, hash: productHash });
                                }

                                return productUrl;
                            }
                        );

                        allUnits.push(unitIds);
                    }
        
                    await Product.updateOne({ _id }, { $set: { generatedHash: true } });
                }
        
                console.log("Generated unit IDs successfully", allUnits);
                await axios.post('https://qr-code-blockchain-1d-backend.onrender.com/generate-qr', {
                    "urls": allUnits
                });
            
            } catch (error) {
                console.error("Error generating unit IDs:", error);
            }
        }, 2000);
  
        return response;
    } catch (error) {
      console.error("Error initializing background process:", error);
      return NextResponse.json({ error: "Internal Server Error" });
    }
}  

export async function POST(request){
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if(!session || !session.user || !session.user._id){
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            )
        }
        const userId = session.user._id;
        const userRole = session.user.role; // Assuming role is stored in session
        
        // Variable to store manufacturerId - will be populated based on role
        let manufacturerId;
        
        // If user is a line manager, find the manufacturer they belong to
        if (userRole === 'lineManager') {
            // Find the manufacturer that has this line manager in their lineManagers array
            const manufacturer = await Manufacturer.findOne({
                "lineManagers._id": userId
            });
            
            if (!manufacturer) {
                return NextResponse.json(
                    { success: false, message: "Line manager not associated with any manufacturer" },
                    { status: 400 }
                );
            }
            
            manufacturerId = manufacturer._id;
        } else if (userRole === 'manufacturer') {
            // For manufacturers, use their own ID
            manufacturerId = userId;
        } else {
            return NextResponse.json(
                { success: false, message: "Unauthorized role" },
                { status: 403 }
            );
        }
        
        const body = await request.json();
        const productsList = body.products;
        if (!Array.isArray(productsList) || productsList.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid product list" },
                { status: 400 }
            );
        }
        
        const groupedProducts = {};
        productsList.forEach(product => {
            const key = `${product.name}-${product.location}`;
            if (!groupedProducts[key]) {
                groupedProducts[key] = [];
            }
            groupedProducts[key].push(product);
        });
        
        const results = [];
        
        // Process each unique product
        for (const [key, products] of Object.entries(groupedProducts)) {
            const [name, location] = key.split('-');
            
            // Find or create the product - now always using the determined manufacturerId
            let product = await Product.findOne({ 
                name: name,
                location: location,
                manufacturerId: manufacturerId
            });
            
            if (!product) {
                product = await Product.create({
                    name: name,
                    location: location,
                    manufacturerId: manufacturerId,
                    batchIds: [],
                    generatedHash: false
                });
            }
            
            // Process batches for this product
            for (const productData of products) {
                const unitsCreated = productData.endSerialNo - productData.startSerialNo + 1;
                const timestamp = productData.timestamp || new Date().toISOString();
                
                // For manufacturers, each product entry becomes its own batch
                if (userRole === 'manufacturer') {
                    const batch = await Batch.create({
                        productId: product._id,
                        batchNo: productData.batchNo,
                        utcTimestamp: new Date(timestamp),
                        totalUnits: unitsCreated,
                        globalStartSerialNo: productData.startSerialNo,
                        globalEndSerialNo: productData.endSerialNo
                    });
                    
                    // Update the product with the new batch ID
                    product.batchIds.push(batch._id);
                    await product.save();
                    
                    results.push({
                        productId: product._id,
                        batchId: batch._id,
                        units: unitsCreated
                    });
                } 
                // For line managers, we need to handle batch merging and serialization
                else if (userRole === 'lineManager') {
                    // Check if a batch with this batch number already exists for this product
                    let batch = await Batch.findOne({
                        productId: product._id,
                        batchNo: productData.batchNo
                    });
                    
                    if (batch) {
                        // Batch exists, add line manager data and update global serials
                        const lineManagerEntry = {
                            lineManagerId: userId,
                            batchStartSerialNo: productData.startSerialNo,
                            batchEndSerialNo: productData.endSerialNo,
                            unitsCreated: unitsCreated,
                            utcTimestamp: new Date(timestamp) // Store the line manager's timestamp
                        };
                        
                        // Add line manager to batch if not already present
                        if (!batch.lineManagers) {
                            batch.lineManagers = [];
                        }
                        
                        batch.lineManagers.push(lineManagerEntry);
                        
                        // Update global serial numbers if needed
                        batch.globalStartSerialNo = Math.min(batch.globalStartSerialNo, productData.startSerialNo);
                        batch.globalEndSerialNo = Math.max(batch.globalEndSerialNo, productData.endSerialNo);
                        
                        // Update total units
                        batch.totalUnits += unitsCreated;
                        
                        await batch.save();
                    } else {
                        // Create new batch with line manager data
                        batch = await Batch.create({
                            productId: product._id,
                            batchNo: productData.batchNo,
                            utcTimestamp: null, // For line manager batches, this should be null
                            totalUnits: unitsCreated,
                            globalStartSerialNo: productData.startSerialNo,
                            globalEndSerialNo: productData.endSerialNo,
                            lineManagers: [{
                                lineManagerId: userId,
                                batchStartSerialNo: productData.startSerialNo,
                                batchEndSerialNo: productData.endSerialNo,
                                unitsCreated: unitsCreated,
                                utcTimestamp: new Date(timestamp) // Store the timestamp with the line manager
                            }]
                        });
                        
                        // Update the product with the new batch ID if not already included
                        if (!product.batchIds.includes(batch._id)) {
                            product.batchIds.push(batch._id);
                            await product.save();
                        }
                    }
                    
                    results.push({
                        productId: product._id,
                        batchId: batch._id,
                        units: unitsCreated
                    });
                }
            }
        }
        
        return NextResponse.json(
            { 
                success: true, 
                message: "Products and batches created successfully",
                data: results 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}