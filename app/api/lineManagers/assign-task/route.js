import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import Manufacturer from '../../../../model/Manufacturer'
import Task from "../../../../model/TaskLM";

export async function POST(request){
 await dbConnect();
 const session = await getServerSession(authOptions);
 if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
        { success: false, message: "Not Authenticated or user ID missing" },
        { status: 400 }
    );
}
try{
    const data =await request.json();
    console.log("Received Data:", data);
    const {manufacturerId,lineManager,location,productName,productPrice,NoOfUnits}=data;
    if(!productPrice || !productName){
        return NextResponse.json({
            success:false,
            message:"All required fields must be filled"
        },{status:400});
    }
      const newTask=new Task({
        manufacturer:manufacturerId,
        lineManagerId:lineManager,
        location,
        productName,
        productPrice,
        NoOfUnits,
      })

      await newTask.save();
      return NextResponse.json({
        success:true,
        message:"Task assigned successfully",
      },{status:200});
}catch(error){
    console.error(error);
    return NextResponse.json({
        success: false,
        message: "Error assigning task. Please try again."
      }, { status: 500 });
}
 
}