import { ethers } from 'ethers';

// Replace these with your actual values
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

export async function POST(request) {
  try {
    const { ipfsHash } = await request.json();

    if (!ipfsHash) {
      return new Response(JSON.stringify({ error: 'IPFS hash missing' }), { status: 400 });
    }

    console.log(ipfsHash)

    // Set up provider and signer
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Send the transaction to store hash
    const tx = await contract.storeHash(ipfsHash);
    await tx.wait(); // Wait for confirmation

    return new Response(JSON.stringify({
      success: true,
      message: 'Hash stored on blockchain successfully',
      txHash: tx.hash
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Blockchain error:', error);
    return new Response(JSON.stringify({ error: 'Blockchain interaction failed' }), { status: 500 });
  }
}
