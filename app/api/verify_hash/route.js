import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

const CONTRACT_ADDRESS = '0x599050B65aa8e431707030F27042859769D29742';
const PROVIDER_URL = 'https://sepolia.infura.io/v3/39715bab56e746109b70cff36598e0f2'; // or Alchemy
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { ipfsHash } = body;

    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const exists = await contract.isHashStored(ipfsHash);
    return NextResponse.json({ exists });
  } catch (err) {
    console.error('Smart contract verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}