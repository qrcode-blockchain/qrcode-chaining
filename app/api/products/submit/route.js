import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import Product from "../../../../model/Product";
import Batch from "../../../../model/Batch";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import Manufacturer from '../../../../model/Manufacturer';
import Task from '../../../../model/TaskLM';

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
        let taskId=null;
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
        console.log("The body is",body);
        
        const productsList = body.products;
        if(userRole==='lineManager'){
             taskId=body.taskId;
             console.log("The task id for line managers is",taskId);
             
             if (!taskId) {
                return NextResponse.json(
                    { success: false, message: "Task ID is required for line managers" },
                    { status: 400 }
                );
            }

        }
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
                    generatedHash: false,
                    price: products[0].price
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
                    await Task.create({
                        manufacturer:manufacturerId,
                        location:productData.location,
                        productName:productData.name,
                        productPrice:productData.price,
                        NoOfUnits:productData.price,
                        status:'in-progress'
                    })
                } 
                // For line managers, we need to handle batch merging and serialization
                else if (userRole === 'lineManager' && taskId) {
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
                        // batch.globalEndSerialNo = Math.max(batch.globalEndSerialNo, productData.endSerialNo);
                        batch.globalEndSerialNo=batch.globalStartSerialNo+ batch.totalUnits + unitsCreated-1;
                        
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
                        units: unitsCreated,
                        // taskID: taskId
                    });
                      const task=await Task.findOne({_id:taskId});
                      if(!task){
                        return NextResponse.json(
                            {success:false , message:"Task is not found"},
                            {status:404}
                        );
                      }
                      task.status='in-progress';
                      await task.save();
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
