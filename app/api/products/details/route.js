import { NextResponse } from "next/server";
import Product from "../../../../model/Product";
import {dbConnect} from "../../../../lib/dbConnect";

export async function GET() {

    try {
        await dbConnect();

        const details = await Product.aggregate([
            {
                $group: {
                    _id: "$name",
                    totalAmount: { $sum: "$totalUnits" },
                    price: { $first: "$price" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return NextResponse.json({ success: true, data: details });    
    } catch (error) {
        console.error("Error fetching product summary:", error);
        return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
    }
}