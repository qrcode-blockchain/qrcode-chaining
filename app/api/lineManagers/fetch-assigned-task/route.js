import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import Task from "../../../../model/TaskLM";

export async function GET(){
    await dbConnect();
    const session =await  getServerSession(authOptions);
    console.log("The session is",session);
    
    if (!session || !session.user || !session.user._id) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }
    try {
        const lineManagerId=session.user._id;
        const tasks=await Task.find({lineManagerId});
         return NextResponse.json(
            {success:true,tasks},
            {status:200}
         );
    } catch (error) {
        console.error("Eror fetching the tasks",error);
return NextResponse.json(
    {success:false,message:"Failed to fetch teh tasks"},
    {status:500}
)
    }
}