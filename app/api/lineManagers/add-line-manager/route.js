import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
//import { sendVerificationEmail } from "../../../helpers/sendVerification";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import Manufacturer from '../../../../model/Manufacturer'
import { LineManagerSchema } from "../../../../Schema/manufacturerSchema";
import { sendCredentialsLM } from "../../../../helpers/sendCredentialsLM";
const generateTempPassword=(length=10)=>{
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    return Array.from({length},()=>chars.charAt(Math.floor(Math.random()*chars.length))).join('')
}
export async function POST(request){
    await dbConnect();
    //authenticate manufacturer
    const session=await getServerSession(authOptions);
    console.log("The session is",session);
    if (!session || !session.manufacturer || !session.manufacturer._id) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated or user ID missing" },
            { status: 400 }
        );
    }
    const manufacturerId=new mongoose.Types.ObjectId(session.manufacturer._id);

    try {
        const data=await request.json();
        const { name, email } = data;

        //basic validation
        if(!name || !email){
            return NextResponse.json({
                success:false,
                message:"All required fields must be filled"
            },{status:400});
        }
        
        const validation=LineManagerSchema.safeParse(data);
        if(!validation.success){
            return NextResponse.json(
              {success:false,message:"Invalid Data",errors:validation.error.format()},
              {status:400}
            );
          }

          //to check if line manager already exist
          const existingManufacturer = await Manufacturer.findOne({
            _id: manufacturerId,
            "lineManagers.email": email
        });
        if (existingManufacturer) {
            return NextResponse.json(
                { success: false, message: "Line Manager with this email already exists" },
                { status: 400 }
            );
        }
//now generate new password
const tempPassword = generateTempPassword();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create the Line Manager object
        const newLineManager = {
            name,
            email,
            password: hashedPassword,
            isSet: false, // Ensures they reset password on first login
        };
     // Store the Line Manager under the authenticated Manufacturer
     const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
        manufacturerId,
        { $push: { lineManagers: newLineManager } },
        { new: true }
    );

    if (!updatedManufacturer) {
        return NextResponse.json(
            { success: false, message: "Manufacturer not found" },
            { status: 404 }
        );
    }
   //send verification email
   const emailResponse=await sendCredentialsLM(
    name,email,tempPassword
   )
   if (!emailResponse.success) {
    return NextResponse.json({
      success: false,
      message: "Failed to send credentials to Line Manager"
    }, { status: 500 });
  }
    return NextResponse.json({
        success: true,
        message: "Line Manager created successfully",
        tempPassword, // Send this back so the manufacturer can see it
        lineManager:{
            name:newLineManager.name,
            email:newLineManager.email,
        }
    });

    } catch (error) {
        console.error("Error creating Line Manager:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong", error: error.message },
            { status: 500 }
        );
    }
}