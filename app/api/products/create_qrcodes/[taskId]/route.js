import Task from '../../../../../model/TaskLM';
import Product from "../../../../../model/Product";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/dbConnect";
import pLimit from 'p-limit';

const limit = pLimit(10);
let errorQRs = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
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

async function storeHashOnBlockchain(ipfsHash) {
    try {
        const chainResponse = await fetch('https://qrcode-ipfs-blockchain.vercel.app/api/blockchain_store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ipfsHash: ipfsHash }),
        });
        
        if (!chainResponse.ok) {
            return { success: false, errorMsg: "Failed to Store data on blockchain"}
        } 
        const chainData = await chainResponse.json();
        console.log('chain Tx:', chainData.txHash);

        return {success: true, chainData: chainData};
    } catch (error) {
        console.log(error);
        return { success: false, errorMsg: error.message };
    }
}

async function storeDataInIpfs(data) {
    try {
        const ipfsResponse = await fetch('https://qrcode-ipfs-blockchain.vercel.app/api/ipfs_store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await ipfsResponse.json();

        if (!result.success) {
            return {success: false, errorMsg: "Failed to store data in Ipfs"}
        }
        return { success: true, ipfsHash: result.ipfsHash };    
    } catch (error) {
        console.log(error)
        return { success: false, errorMsg: error.message };
    }
}

async function processBatches(productData, useBlockchainFlag, manufacturerName) {
    const { _id, name, location, createdAt, price, batchNo, totalUnits, startSerialNo } = productData;

    const tasks = Array.from({ length: totalUnits }, (_, i) => {
        const serialNumber = String(startSerialNo + i);
        const createdAtDate = new Date(createdAt);
        const formattedDate = createdAtDate.getFullYear().toString() +
            String(createdAtDate.getMonth() + 1).padStart(2, '0') +
            String(createdAtDate.getDate()).padStart(2, '0');

        const data = {
            _id: _id,
            product_name: name,
            batch_number: batchNo,
            location,
            date: formattedDate,
            price,
            serial_number: serialNumber,
            weight: '12',
            man_name: manufacturerName,
        };

        return async () => {
            const ipfsResponse = await storeDataInIpfs(data);

            if (!ipfsResponse.success) {
                errorQRs.push({ productData: data, error: ipfsResponse.errorMsg });
                return '';
            }
            const ipfsHash = ipfsResponse.ipfsHash;
            const productUrl = `https://qrcode-ipfs-blockchain.vercel.app/products/${ipfsHash}`;
            console.log(`IPFS CID for ${data.serial_number}`,ipfsHash);

            if (useBlockchainFlag) {
                const result = await storeHashOnBlockchain(ipfsHash);
                if (!result.success) {
                    errorQRs.push({ url: productUrl, hash: ipfsHash, error: result.errorMsg });
                    return '';
                }
            }

            return { data, url: productUrl };
        };
    });
    const batchedTasks = chunkArray(tasks, 5);
    let results = [];

    for (const batch of batchedTasks) {
        const batchResults = await Promise.all(batch.map(task => limit(task)));
        results.push(...batchResults);

        await sleep(300);
    }
    return results;
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
        
                let completedUnits = [];
                
                const { useBlockchainFlag, manufacturerName, manufacturerEmail } = productsWithBatches[0].manufacturerDetails
        
                for (const product of productsWithBatches) {
                    const { _id, name, location, createdAt, price, batches } = product;
                    console.log("product", product)

                    for (const batch of batches) {
                        const { batchNo, startSerialNo, endSerialNo } = batch;
                        const totalUnits = endSerialNo - startSerialNo + 1;

                        const unitIds = await processBatches({ _id, name, location, createdAt, price, batchNo, totalUnits, startSerialNo }, 
                            useBlockchainFlag, manufacturerName
                        );
                        completedUnits.push(unitIds);
                    }
        
                    await Product.updateOne({ _id }, { $set: { generatedHash: true } });
                }
                console.log("Number of Failed QR codes: ", errorQRs.length);

                const flatUrlsArray = completedUnits.flat();
                console.log("Generated QR urls successfully: ", (flatUrlsArray.length - errorQRs.length));

                const pdfReponse = await fetch('https://www.qrcipher.in/api/generate-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dataArray: flatUrlsArray,
                        email: "mayaggarwal@gmail.com"
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
