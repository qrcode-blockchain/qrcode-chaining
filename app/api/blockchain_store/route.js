// import { ethers } from 'ethers';

// // Replace these with your actual values
// const CONTRACT_ADDRESS = "0x599050B65aa8e431707030F27042859769D29742";
// const CONTRACT_ABI = [
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "ipfsHash",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "sender",
// 				"type": "address"
// 			}
// 		],
// 		"name": "HashStored",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "ipfsHash",
// 				"type": "string"
// 			}
// 		],
// 		"name": "storeHash",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "ipfsHash",
// 				"type": "string"
// 			}
// 		],
// 		"name": "isHashStored",
// 		"outputs": [
// 			{
// 				"internalType": "bool",
// 				"name": "",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]; 
// const PRIVATE_KEY = "e0ceb3b521801626476f0acfa4b36c56d16aeadec2fb6116503f9d06f329f2e3"; // Funded wallet key (Sepolia ETH)
// const RPC_URL = "https://sepolia.infura.io/v3/39715bab56e746109b70cff36598e0f2"; // or Alchemy

// export async function POST(request) {
//   try {
//     const { ipfsHash } = await request.json();

//     if (!ipfsHash) {
//       return new Response(JSON.stringify({ error: 'IPFS hash missing' }), { status: 400 });
//     }

//     console.log(ipfsHash)

//     // Set up provider and signer
//     const provider = new ethers.JsonRpcProvider(RPC_URL);
//     const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
//     const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

//     // Send the transaction to store hash
//     const tx = await contract.storeHash(ipfsHash);
//     await tx.wait(); // Wait for confirmation

//     return new Response(JSON.stringify({
//       success: true,
//       message: 'Hash stored on blockchain successfully',
//       txHash: tx.hash
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('Blockchain error:', error);
//     return new Response(JSON.stringify({ error: 'Blockchain interaction failed' }), { status: 500 });
//   }
// }
import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

const CONTRACT_ADDRESS = "0x599050B65aa8e431707030F27042859769D29742";
const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "HashStored",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "storeHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "isHashStored",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; 
const PRIVATE_KEY = "e0ceb3b521801626476f0acfa4b36c56d16aeadec2fb6116503f9d06f329f2e3"; // Funded wallet key (Sepolia ETH)
const RPC_URL = "https://sepolia.infura.io/v3/39715bab56e746109b70cff36598e0f2"; // or Alchemy

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {
	try {
		const { ipfsHashes } = await request.json();
		
		if (!ipfsHashes || !Array.isArray(ipfsHashes) || ipfsHashes.length === 0) {
			return new NextResponse(JSON.stringify({ 
				error: 'ipfsHashes array is required and must not be empty' 
			}), { 
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
		
		console.log(`Received ${ipfsHashes.length} IPFS hashes from frontend`);
		console.log(`Starting to process all ${ipfsHashes.length} IPFS hashes...`);
		
		const provider = new ethers.JsonRpcProvider(RPC_URL);
		const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
		const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

		const results = [];
		const startTime = Date.now();

		for (let i = 0; i < ipfsHashes.length; i++) {
			const currentHash = ipfsHashes[i];
			
			try {
				console.log(`Processing hash ${i + 1}/${ipfsHashes.length}: ${currentHash}`);
				
				if (i > 0) {
					console.log(`Adding delay before transaction ${i + 1}...`);
					await delay(3000); 
				}
				const tx = await contract.storeHash(currentHash);
				console.log(`Transaction ${i + 1} sent: ${tx.hash}`);
				
				const receipt = await tx.wait();
				console.log(`Transaction ${i + 1} confirmed in block: ${receipt.blockNumber}`);

				results.push({ hash: currentHash, status: 'success'});
				
				await delay(1000);

			} catch (error) {
				console.error(`Error processing hash ${i + 1} (${currentHash}):, error.message`);
				
				results.push({ hash: currentHash, status: 'failed', error: error.message });
				
				await delay(2000);
			}
		}

		const endTime = Date.now();
		const totalTime = Math.round((endTime - startTime) / 1000);
		
		const successCount = results.filter(r => r.status === 'success').length;
		const failedCount = results.filter(r => r.status === 'failed').length;

		console.log(`Completed processing all hashes. Success: ${successCount}, Failed: ${failedCount}, Total time: ${totalTime}s`);

		return new NextResponse(JSON.stringify({
				success: true,
				message: `Processed all ${ipfsHashes.length} IPFS hashes`,
				summary: {
					totalHashes: ipfsHashes.length,
					successful: successCount,
					failed: failedCount,
					totalTimeSeconds: totalTime
				},
				results: results
			}), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);

	} catch (error) {
		console.error('Critical blockchain error:', error);
		
		return new NextResponse(JSON.stringify({ 
				error: 'Critical blockchain interaction failed',
				details: error.message 
			}), { 
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
