import Task from '../../../../model/TaskLM';
import Product from "../../../../model/Product";
import Batch from '../../../../model/Batch';
import Manufacturer from '../../../../model/Manufacturer';
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import pLimit from 'p-limit';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/option';
import axios from 'axios';

const limit = pLimit(30);
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
    const ipfsResponse = await fetch('https://www.qrcipher.in/api/ipfs_store', {
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

async function storeHashOnBlockchain(ipfsHashArray) {
    try {
        const chainResponse = await axios.post(`https://www.qrcipher.in/api/contract/blockchain-store`, {
                metadataArray: ipfsHashArray,
            }, {
                timeout: 18000000
        });

        if (chainResponse.status != 200) {
            return { success: false, errorMsg: "Failed to Store data on blockchain"}
        } 
        console.log("Response From Blockchain");

        const chainData = await chainResponse.data;
        return {success: true, runtime: chainData.runtime};
    } catch (error) {
        console.log(error);
        return { success: false, errorMsg: error.message };
    }
}

async function processBatches(productData, useBlockchainFlag, manufacturerName) {
  console.log("The processBatches function is hit");
  console.log("Function Flag: ", useBlockchainFlag);

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

          if (!ipfsResponse.success) {
              errorQRs.push({ productData: data, error: ipfsResponse.errorMsg });
              return { data, url: '' };
          }

          const ipfsHash = ipfsResponse.ipfsHash;

          let productUrl;
          if (useBlockchainFlag) {
              productUrl = `https://www.qrcipher.in/products/${ipfsHash + "bcf"}`;
          } else {
              productUrl = `https://www.qrcipher.in/products/${ipfsHash}`;
          }

          console.log(`IPFS CID for ${data.serial_number}: ${ipfsHash}`);

          return { data, url: productUrl, cid: ipfsHash };
      };
  });

  const batchedTasks = chunkArray(tasks, 30);
  let results = [], metadataArray = [];

  for (const batch of batchedTasks) {
      const batchResults = await Promise.all(batch.map(task => limit(task)));
      results.push(...batchResults);
      await sleep(300);

      const batchCids = batchResults.map(r => r.cid).filter(Boolean);
      metadataArray.push(...batchCids);

      await sleep(300);
  }

  if (useBlockchainFlag) {
    const batchSize = 100;
    const blockchainChunks = chunkArray(metadataArray, batchSize);

    const blockchainTasks = blockchainChunks.map((batch, idx) =>
        limit(async () => {
            return await storeHashOnBlockchain(batch);
        })
    );

    const blockchainResults = await Promise.all(blockchainTasks);
    console.log(blockchainResults);

    return {results: results, contractRuntime: blockchainResults?.runtime};
  }

  return {results: results};
}

export async function POST(request) {
    console.log("The craete qr codes api is being hit");
    
  await dbConnect();
  const body = await request.json();
  const { taskId, batchNo, endSerial, startSerial, unitsCreated, createdAt,productId } = body;
  const session=await getServerSession(authOptions);
  try {
   

   
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
        console.log('Flag: ', useBlockchain);
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
        
        const flatUrlsArray = unitResults.results.flat();
        console.log("Generated QR URLs:", flatUrlsArray.length);
        console.log("Failed QR codes:", errorQRs.length);

        // const pdfResponse = await fetch('https://www.qrcipher.in/api/generate-pdf', {
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
console.log("Hitting the generate pdf now");
const API = "https://www.qrcipher.in";
//"https://www.qrcipher.in"
const pdfResponse = await fetch(`${API}/api/generate-pdf`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dataArray: flatUrlsArray,
    email: "carol.lobo2005@gmail.com",
    taskId: taskId,
    batchNo:batchNo,
    productName:productName
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
        //await Task.findByIdAndUpdate(taskId, { status: 'completed' });
      } catch (error) {
        console.error("Error generating unit IDs:", error);
      }
    

    return NextResponse.json(
      { success: true, message: "Successful" },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error initializing background process:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
