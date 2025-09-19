import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import Location from "../../../model/Location";
import Product from "../../../model/Product";

await dbConnect();

export async function POST(request) {
    try {
        const body = await request.json();
        const { latitude, longitude, pageUrl, googleMapsLink, productId } = body;

        console.log(latitude, longitude, pageUrl, googleMapsLink, productId);

        if (latitude && longitude && pageUrl && googleMapsLink && productId) {
            const manufacturerId = await Product.find({ _id: productId }, { manufacturerId: 1 });
            console.log("Manufacturer ID: ", manufacturerId);

            const scannedCode = await new Location({
                latitude,
                longitude,
                googleMapsLink,
                pageUrl,
                manufacturerId: manufacturerId[0].manufacturerId,
                productId
            }).save()
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            errorMsg: error
        });
    }
}