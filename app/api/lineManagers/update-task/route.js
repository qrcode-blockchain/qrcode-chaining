import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";

import Task from "../../../../model/TaskLM";
import Product from '../../../../model/Product';
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
    
    const {newCompletedUnits,taskId}=await request.json();
   const task=await Task.findById({_id:taskId});
    
   task.completedUnits=newCompletedUnits;
   task.endSerialNo=newCompletedUnits;
   task.status='in-progress';
   await task.save();
   return NextResponse.json({
   success:true,
   message:"Task ahs been successfully updated"
   })
    
      

   
}catch(error){
    console.error(error);
    return NextResponse.json({
        success: false,
        message: "Error assigning task. Please try again."
      }, { status: 500 });
}
 
}

