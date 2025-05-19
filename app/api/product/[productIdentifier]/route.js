import { dbConnect } from "../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "../../../../model/Product";

export async function GET(request, { params }) {
    const {productIdentifier} = await params;
    try{
        await dbConnect();
        const result = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productIdentifier),
                },
            },
            {
                $lookup: {
                    from: "batches",
                    localField: "_id",
                    foreignField: "productId",
                    as: "batches",
                },
            },
            {
                $unwind: {
                    path: "$batches",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "manufacturers",
                    localField: "manufacturerId",
                    foreignField: "_id",
                    as: "manufacturer",
                },
            },
            {
                $unwind: {
                    path: "$manufacturer",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    location: 1,
                    date: "$createdAt",
                    price: 1,
                    manufacturerName: "$manufacturer.name",
                },
            },
        ]);
        
        return NextResponse.json(
            {success: true, product: result[0]},
            {status: 200}
        )
        
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {success: false, errorMsg: "Server Error"},
            {status: 500}
        )
    }
}