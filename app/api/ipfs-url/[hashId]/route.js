import { NextResponse } from "next/server";
import Batch from "../../../../model/Batch";
import { dbConnect } from "../../../../lib/dbConnect";
import mongoose from "mongoose"

export async function GET(request, { params }) {
    const {hashId} = await params;
    await dbConnect();

    try{
        const dataResponse = await fetch(`https://ipfs.io/ipfs/${hashId}`);
        if (!dataResponse.ok) {
            return NextResponse.json({ success: false, data: null });
        }
        let productData = await dataResponse.json();

        const batchData = await Batch.findOne({ batchNo: productData.batch_number, productId: new mongoose.Types.ObjectId(productData?._id) }, 
                                                { marketingVideoUrl: 1 });

        productData.videoUrl = batchData?.marketingVideoUrl || null;
        console.log(productData, batchData);

        return NextResponse.json({ success: true, data: productData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message });
    }
}