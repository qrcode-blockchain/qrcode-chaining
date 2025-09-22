import { NextResponse } from "next/server";
import { ContractId, ContractFunctionParameters, ContractExecuteTransaction } from "@hashgraph/sdk";
import environmentSetup from "../../../../lib/setup";

async function storeViaContract(client, metadataArray, contractId) {
    // const CONTRACT_ID = ContractId.fromString(contractId);
    // console.log("ContractId: ",CONTRACT_ID);

    for (let i = 0; i < metadataArray.length; i += 10) {
        const segment = metadataArray.slice(i, i + 10);
        
        const storeProducts = new ContractExecuteTransaction()
            .setContractId(process.env.CONTRACT_ID)
            .setGas(300000)
            .setFunction("addProduct",
                new ContractFunctionParameters().addStringArray(segment)
            );

        const storeProductsTx = await storeProducts.execute(client);
        const storeProductsRx = await storeProductsTx.getRecord(client);
        console.log("Contract execution record:", storeProductsRx);
    }

    return [];
}

export async function POST(req) {
    let serialNumbers = [];

    try {
        const { metadataArray } = await req.json();
        const client = await environmentSetup();

        const start = performance.now();
        
        serialNumbers = await storeViaContract(client, metadataArray, '');
        
        const end = performance.now();
        console.log(`Time taken to store ${metadataArray.length} units - ${end - start}ms`);
        
        return NextResponse.json({ success: true, runtime: (end - start) }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
}