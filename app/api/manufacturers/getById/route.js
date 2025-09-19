
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import Manufacturer from "../../../../model/Manufacturer";

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    // Get manufacturerId from the URL query params
    const url = new URL(request.url);
    console.log("The url is",url);
    
    const manufacturerId = url.searchParams.get('id');
    console.log("Th manufacturer id in url si",manufacturerId);
    
    
    if (!manufacturerId) {
        return NextResponse.json(
            { success: false, message: "Manufacturer ID is required" },
            { status: 400 }
        );
    }
    
    try {
        const manufacturer = await Manufacturer.findById(manufacturerId);
        console.log("The manufacturer in the api is",manufacturer);
        
        if (!manufacturer) {
            return NextResponse.json(
                { success: false, message: "Manufacturer not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { success: true, manufacturer },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching manufacturer:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch manufacturer" },
            { status: 500 }
        );
    }
}

