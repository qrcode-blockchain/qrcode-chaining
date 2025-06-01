import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import Task from "../../../../model/TaskLM";
import Manufacturer from "../../../../model/Manufacturer";
export async function GET(){
    await dbConnect();
    const session =await  getServerSession(authOptions);
   // console.log("The session is",session);
    
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }
    try {
      console.log("The fetch api is hit");
      
        if(session.user.role==='lineManager'){
            const lineManagerId=session.user._id;
            const tasks=await Task.find({lineManagerId});
            return NextResponse.json(
                {success:true,tasks},
                {status:200}
             );
        }else if(session.user.role==='manufacturer'){
            const manufacturerId=session.user._id;
            const taskList = await Task.find({ manufacturer:manufacturerId });
            const manufacturer = await Manufacturer.findById(manufacturerId);
            
            const enrichedTasks = taskList.map(task => {
              const lineManager = manufacturer.lineManagers.find(
                lm => lm._id.toString() === task.lineManagerId?.toString()
              );
              return {
                ...task.toObject(),
                lineManagerName: lineManager?.name || "Unknown"
              };
            });
            console.log("The fetch api is",enrichedTasks);
            
            return NextResponse.json({
              success: true,
              message: "Successful",
              tasks: enrichedTasks
            }, { status: 200 });
            
        }
        
       
        
       
    } catch (error) {
        console.error("Eror fetching the tasks",error);
return NextResponse.json(
    {success:false,message:"Failed to fetch teh tasks"},
    {status:500}
)
    }
}