import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import Manufacturer from "../../../../model/Manufacturer";


export async function GET(){
    console.log("The api in backend is being hit");
    
    await dbConnect();
    const session= await getServerSession(authOptions);
    console.log("THE SESSION IS",session);
    
    if(!session || !session.user || !session.user._id){
        return NextResponse.json(
            {success:false,message:"Session not present"},
            {status:401}
        );
    }

    const manufacturerId=session.user._id;
    console.log("The manu id is",manufacturerId);
    
    try {
        const manufacturer=await Manufacturer.findById(manufacturerId);
        console.log("The manufacturer in api is",manufacturer);
        
        if (!manufacturer) {
            return NextResponse.json(
                { success: false, message: "Manufacturer not found" },
                { status: 404 }
            );
        }
        
        
        return NextResponse.json({
            success: true,
            preferences: {
                useBlockchain: manufacturer.useBlockchain || false
                // Add other preferences here as needed
            }
        });

    } catch (error) {
        console.error("Error fetching manufacturer preferences:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch preferences" },
            { status: 500 }
        );
    }
}

export async function PUT(request){
    await dbConnect();
    const session =await getServerSession(authOptions);

    if(!session || !session.user || !session.user._id){
        return NextResponse.json(
            {success:false},
        {status:401}
        );
    }

    const body=await request.json();
    const {useBlockchain}=body;
    
    if (typeof useBlockchain !== 'boolean') {
        return NextResponse.json(
            { success: false, message: "Invalid request: useBlockchain must be a boolean" },
            { status: 400 }
        );
    }
const manufacturerId=session.user._id;
    try {
        const updatedManufacturer=await Manufacturer.findByIdAndUpdate(
            manufacturerId,
            {$set:{useBlockchain}},
            {new:true}
        )
        if(!updatedManufacturer){
            return NextResponse.json(
                {success:false,message:"Manufacturer not found"},
                {status:404}
            );
        }
        return NextResponse.json({
            success:true,
            message:"Blockchain preference has been updated successfully",
            preferences:{
                useBlockchain:updatedManufacturer.useBlockchain
            }
        })
    } catch (error) {
        console.error("Error updating manufacturer preferences:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update preferences" },
            { status: 500 }
        ); 
    }
}