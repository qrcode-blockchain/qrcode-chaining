import crypto from "crypto";
import path from "path";
import { NextResponse } from "next/server";
import {dbConnect} from "../../../lib/dbConnect";
import Product from "../../../model/Product";
import { writeFile } from "fs/promises";

await dbConnect();

const generateHash = (input) => 
    crypto.createHash("sha256").update(input).digest("hex");

export async function GET() {
    try {
        const response = NextResponse.json(
            { success: true, message: "Processing in background" }, 
            { status: 202 }
        );

        setTimeout(async () => {
            try {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);

                const products = await Product.find(
                    { 
                        createdAt: { $gte: today },
                        hashGenerated: { $ne: true }
                    },
                    "_id name location date batchNo serialNo amount"
                );

                console.log("Products found: ", products);

                const allUnits = await Promise.all(
                    products.map(async (product) => {
                        const { _id, name, location, date, batchNo, startSerialNo,endSerialNo, NoOfUnits } = product;

                        const unitIds = Array.from({ length: amount }, (_, i) =>
                            `${_id.toString()}${generateHash(`${name}-${location}-${date}-${batchNo}-${Number(startSerialNo) + i}`)}`
                        );

                        const filePath = path.join(process.cwd(), "data.txt");
                        await writeFile(filePath, JSON.stringify(unitIds, null, 2));

                        await Product.updateOne(
                            { _id },
                            { $set: { hashGenerated: true } }
                        );

                        return { productId: _id, unitIds };
                    })
                );

                console.log("Generated unit IDs successfully", allUnits);
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

export async function POST(request) {
    try {
        const body = await request.json();
        const productsList = body.products;

        if (!Array.isArray(productsList) || productsList.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid product list" },
                { status: 400 }
            );
        }

        const result = await Product.insertMany(
            productsList.map((product) => ({
                ...product,
                hashGenerated: false
            }))
        );

        return NextResponse.json(
            { success: true, data: result },
            { status: 201 }
        );
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
