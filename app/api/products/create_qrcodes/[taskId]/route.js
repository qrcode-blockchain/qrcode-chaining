import Task from '../../../../../model/TaskLM';
import Product from "../../../../../model/Product";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/dbConnect";
import crypto from 'crypto';

const generateHash = (input) =>
    crypto.createHash("sha256").update(input).digest("hex");

async function createContractTransaction(productUrl, productHash) {
    const response = await fetch('https://www.qrcipher.in/api/contract_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...data,
            url: productUrl,
            hashValue: productHash
        })
    });

    const result = await response.json();
    return result;
}

async function getProductAndManufacturerDetails() {
    const productsDetails = await Product.aggregate([
        {
            $match: {
                generatedHash: { $ne: true }
            }
        },
        {
            $lookup: {
                from: "batches",
                localField: "_id",
                foreignField: "productId",
                as: "batches"
            }
        },
        {
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
                price: 1,
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
                    manufacturerName: { $arrayElemAt: ["$manufacturer.name", 0] },
                    manufacturerEmail: { $arrayElemAt: ["$manufacturer.email", 0] },
                    manuWebpage: { $arrayElemAt: ["$manufacturer.website", 0] },
                    useBlockchainFlag: { $arrayElemAt: ["$manufacturer.useBlockchain", 0] }
                }
            }
        }
    ]);

    return productsDetails;
}
  
export async function GET(request, { params }) {
    const {taskId} = await params;
    await dbConnect();
  
    try {
        const response = NextResponse.json(
            { success: true, message: "Processing in background" },
            { status: 202 }
        );
  
        setTimeout(async () => {
            try {
                const productsWithBatches = await getProductAndManufacturerDetails();
    
                if (!productsWithBatches.length) {
                    console.log("No products found for today.");
                    return;
                }
                console.log(productsWithBatches);
        
                const completedUnits = [];
                const errorQRs = [];
                const { useBlockchainFlag, manufacturerName, manufacturerEmail } = productsWithBatches[0].manufacturerDetails
        
                for (const product of productsWithBatches) {
                    const { _id, name, location, createdAt, price, batches } = product;
                    console.log("product", product)

                    for (const batch of batches) {
                        const { batchNo, startSerialNo, endSerialNo } = batch;
                        const totalUnits = endSerialNo - startSerialNo + 1;
            
                        const unitIds = await Promise.all(Array.from({ length: totalUnits }, async (_, i) => {
                                const createdAtDate = new Date(createdAt);
                                const formattedDate = createdAtDate.getFullYear().toString() +
                                                    String(createdAtDate.getMonth() + 1).padStart(2, '0') +
                                                    String(createdAtDate.getDate()).padStart(2, '0');
                                
                                const productUrl = `https://www.qrcipher.in/products/${name}/${location}/${formattedDate}/${batchNo}/${startSerialNo + i}/${_id.toString()}`;
                                
                                if (useBlockchainFlag) {
                                    const productHash = generateHash( `${_id.toString()}${generateHash(`${name}${location}${formattedDate}${batchNo}${startSerialNo + i}`)}`);
                                    const data = {
                                        product_name: `${name}`,
                                        batch_number: `${batchNo}`,
                                        location: `${location}`,
                                        date: `${formattedDate}`,
                                        serial_number: String(startSerialNo + i),
                                        price: `${price}`,
                                        weight: '12',
                                        man_name: `${manufacturerName}`
                                    };
                                    const result = await createContractTransaction(data, productUrl, productHash);
                                    console.log(result?.txHash);

                                    if (!result.success) {
                                        errorQRs.push({ url: productUrl, hash: productHash, error: result.error });
                                    }
                                }
                                return productUrl;
                            }
                        ));

                        completedUnits.push(unitIds);
                    }
        
                    await Product.updateOne({ _id }, { $set: { generatedHash: true } });
                }
                console.log("QR codes with errors: ",errorQRs);

                // if (errorQRs) {
                //     for (let qr of errorQRs) {
                //         let productUrl = qr.url;
                //         let productHash = qr.hash;

                //         if (useBlockchainFlag) {
                //             const response = await fetch('https://www.qrcipher.in/api/contract_api', {
                //                     method: 'POST',
                //                     headers: { 'Content-Type': 'application/json' },
                //                     body: JSON.stringify({
                //                     ...data,
                //                     url:productUrl,
                //                     hashValue:productHash
                //                 })
                //             });
                //             const result = await response.json();
                //             console.log(result?.txHash);
                //         }
                //     }
                // }
                console.log("Generated unit IDs successfully");

                const flatUrlsArray = completedUnits.flat();   
                const pdfReponse = await fetch('https://www.qrcipher.in/api/generate-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        urls: flatUrlsArray,
                        email:  'mayaggarwal@gmail.com' //"keithzidand@gmail.com"
                        // email: manufacturerEmail
                    })
                });
                const pdfResult = await pdfReponse.json();
                if (!pdfResult.success) {
                    console.error('An error occured');
                }

                await Task.findByIdAndUpdate(taskId, { status: 'completed' });
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
