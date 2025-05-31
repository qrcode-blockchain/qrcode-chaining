import Task from '../../../../model/TaskLM';
import Product from "../../../../model/Product";
import Batch from '../../../../model/Batch';
import Manufacturer from '../../../../model/Manufacturer';
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import pLimit from 'p-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/option';

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

async function storeDataInIpfs(data) {
  try {
    const ipfsResponse = await fetch('http://localhost:3000/api/ipfs_store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    //console.log("The ipfs response is",ipfsResponse);
    
    const result = await ipfsResponse.json();
   // console.log("The ipfs response after json is",result);
    
    if (!result.success) {
      return { success: false, errorMsg: "Failed to store data in IPFS" };
    }

    return { success: true, ipfsHash: result.ipfsHash };
  } catch (error) {
    console.error(error);
    return { success: false, errorMsg: error.message };
  }
}

async function storeHashOnBlockchain(ipfsHash) {
  try {
    const chainResponse = await fetch('https://www.qrcipher.in/api/blockchain_store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipfsHash }),
    });

    if (!chainResponse.ok) {
      return { success: false, errorMsg: "Failed to store data on blockchain" };
    }

    const chainData = await chainResponse.json();
    console.log('Chain Tx:', chainData.txHash);

    return { success: true, chainData };
  } catch (error) {
    console.error(error);
    return { success: false, errorMsg: error.message };
  }
}

async function processBatches(productData, useBlockchainFlag, manufacturerName) {
    console.log("The process abtches fucntion is hit");
    
  const {
    productId,
    productName,
    location,
    createdAt,
    productPrice,
    batchNo,
    unitsCreated,
    startSerial,
  } = productData;

  const tasks = Array.from({ length: unitsCreated }, (_, i) => {
    const serialNumber = String(startSerial + i);
    const formattedDate = new Date(createdAt).toISOString().slice(0, 10).replace(/-/g, '');

    const data = {
      _id: productId,
      product_name: productName,
      batch_number: batchNo,
      location,
      date: formattedDate,
      productPrice,
      serial_number: serialNumber,
      weight: '12',
      man_name: manufacturerName,
    };

    return async () => {
      const ipfsResponse = await storeDataInIpfs(data);
     // console.log("The ipfs response after function is",ipfsResponse);
      
      if (!ipfsResponse.success) {
        errorQRs.push({ productData: data, error: ipfsResponse.errorMsg });
        return { data, url: '' };
      }

      const ipfsHash = ipfsResponse.ipfsHash;
      //console.log("The ipfs hash is",ipfsHash);
      
      let productUrl = `https://www.qrcipher.in/products/${ipfsHash}`;

      // Optional blockchain integration (currently disabled)
      // if (useBlockchainFlag) {
      //   productUrl = `https://www.qrcipher.in/products/${ipfsHash}bcf`;
      //   const result = await storeHashOnBlockchain(ipfsHash);
      //   if (!result.success) {
      //     errorQRs.push({ url: productUrl, hash: ipfsHash, error: result.errorMsg });
      //     return { data, url: '' };
      //   }
      // }
      console.log("The data and product url is",productUrl);
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

export async function POST(request) {
    console.log("The craete qr codes api is being hit");
    
  await dbConnect();
  const body = await request.json();
  const { taskId, batchNo, endSerial, startSerial, unitsCreated, createdAt } = body;
  const session=await getServerSession(authOptions);
  try {
    const response = NextResponse.json(
      { success: true, message: "Processing in background" },
      { status: 202 }
    );

    setTimeout(async () => {
      try {
        const task = await Task.findById({ _id: taskId });
        if (!task) {
          console.error("Task not found");
          return;
        }

        const {
          productId,
          productName,
          location,
          productPrice,
          useBlockchain,
        } = task;
        const product=await Product.find({_id:productId})
       
       
        const manufacturer = await Manufacturer.findById({ _id: task.manufacturer });
        const manufacturerName = manufacturer.name;
        console.log("The manufacturer name is",manufacturerName);
        
        const unitResults = await processBatches(
          {
            productId,
            productName,
            location,
            createdAt,
            productPrice,
            batchNo,
            unitsCreated,
            startSerial,
          },
          useBlockchain,
          manufacturerName
        );
        await Batch.updateOne(
          {
            productId: productId,
            batchNo: batchNo,
            "lineManagers.lineManagerId": session.user._id,
            "lineManagers.utcTimestamp": new Date(createdAt),
          },
          {
            $set: {
              "lineManagers.$.generatedHash": true,
            },
          }
        );
        
        const flatUrlsArray = unitResults.flat();
        console.log("Generated QR URLs:", flatUrlsArray.length);
        console.log("Failed QR codes:", errorQRs.length);

        // const pdfResponse = await fetch('http://localhost:3000/api/generate-pdf', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     dataArray: flatUrlsArray,
        //     email: "carol.lobo2005@gmail.com",
        //   }),
        // });

        // const pdfResult = await pdfResponse.json();
        // if (!pdfResult.success) {
        //   console.error('Failed to generate PDF');
        // }
// Replace the problematic section around line 192-206 with this:

const pdfResponse = await fetch('http://localhost:3000/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dataArray: flatUrlsArray,
    email: "carol.lobo2005@gmail.com",
  }),
});

// Add proper error handling for non-JSON responses
let pdfResult;
try {
  // Check if the response is actually JSON
  const contentType = pdfResponse.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    pdfResult = await pdfResponse.json();
  } else {
    // Handle non-JSON responses (likely error messages)
    const textResponse = await pdfResponse.text();
    console.error('PDF generation failed with non-JSON response:', textResponse);
    pdfResult = { success: false, error: textResponse };
  }
} catch (jsonError) {
  // Fallback if JSON parsing fails
  console.error('Failed to parse PDF response:', jsonError);
  const textResponse = await pdfResponse.text();
  console.error('Raw response:', textResponse);
  pdfResult = { success: false, error: 'Invalid response format' };
}

if (!pdfResult.success) {
  console.error('Failed to generate PDF:', pdfResult.error || 'Unknown error');
} else {
  console.log('PDF generated successfully');
}
        await Task.findByIdAndUpdate(taskId, { status: 'completed' });
      } catch (error) {
        console.error("Error generating unit IDs:", error);
      }
    }, 2000);

    return response;
  } catch (error) {
    console.error("Error initializing background process:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
