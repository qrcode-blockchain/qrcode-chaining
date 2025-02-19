import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/mongodb";

export async function GET() {

    try {
        await connectDB();

        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$name",
                    totalAmount: { $sum: "$amount" },
                    price: { $first: "$price" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return NextResponse.json({ success: true, data: summary });    
    } catch (error) {
        console.error("Error fetching product summary:", error);
        return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
    }
}