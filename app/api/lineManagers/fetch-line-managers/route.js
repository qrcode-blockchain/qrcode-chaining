import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import mongoose from "mongoose";
import Manufacturer from '../../../../model/Manufacturer';

export async function GET(request) {
    await dbConnect();
    
    // Authenticate manufacturer
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json(
            { success: false, message: "Not authenticated or user ID missing" },
            { status: 401 }
        );
    }
    
    try {
        const manufacturerId = new mongoose.Types.ObjectId(session.user._id);
        
        // Find the manufacturer and retrieve their line managers
        const manufacturer = await Manufacturer.findById(manufacturerId);
        
        if (!manufacturer) {
            return NextResponse.json(
                { success: false, message: "Manufacturer not found" },
                { status: 404 }
            );
        }
        
        // Map line managers to only return the necessary fields (exclude password and sensitive info)
        const lineManagers = manufacturer.lineManagers.map(manager => ({
            name: manager.name,
            email: manager.email,
            _id: manager._id
        }));
        
        return NextResponse.json({
            success: true,
            lineManagers
        });
        
    } catch (error) {
        console.error("Error fetching line managers:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong", error: error.message },
            { status: 500 }
        );
    }
}