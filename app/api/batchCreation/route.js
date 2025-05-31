import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "../../../lib/dbConnect";
import Product from "../../../model/Product";
import Task from "../../../model/TaskLM";
import Batch from "../../../model/Batch";
import mongoose from "mongoose";



export async function POST(request) {
  await dbConnect();

  const mongoSession = await mongoose.startSession();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated or user ID missing" },
      { status: 401 }
    );
  }

  try {
    mongoSession.startTransaction();

    const { data, taskId } = await request.json();
    const {
      batchNo,
      totalUnits,
      startSerialNo,
      endSerialNo,
      lineManagerId,
      assignedAt,
    } = data;

    console.log("Task ID:", taskId);
    console.log("Request data:", data);

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    const product = await Product.findById(task.productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const unitsCreated = endSerialNo - startSerialNo + 1;
    let batch = await Batch.findOne({ productId: product._id, batchNo });

    if (batch) {
      const alreadyAssigned = batch.lineManagers.some((lm) => {
        const isSameManager = lm.lineManagerId.toString() === session.user._id;
        const isSameDate =
          new Date(lm.utcTimestamp).toDateString() ===
          new Date(assignedAt).toDateString();
        return isSameManager && isSameDate;
      });

      if (alreadyAssigned) {
        return NextResponse.json(
          {
            success: false,
            message: `You have already submitted batch ${batch.batchNo}.`,
          },
          { status: 409 }
        );
      }

      batch.lineManagers.push({
        lineManagerId: session.user._id,
        batchStartSerialNo: startSerialNo,
        batchEndSerialNo: endSerialNo,
        unitsCreated,
        utcTimestamp: new Date(),
      });

      batch.totalUnits = batch.lineManagers.reduce(
        (sum, lm) => sum + lm.unitsCreated,
        0
      );

      batch.globalStartSerialNo = Math.min(
        ...batch.lineManagers.map((lm) => lm.batchStartSerialNo)
      );

      batch.globalEndSerialNo =
        batch.globalStartSerialNo + batch.totalUnits - 1;

      await batch.save({ session: mongoSession });
    } else {
      batch = new Batch({
        productId: product._id,
        batchNo,
        totalUnits: unitsCreated,
        globalStartSerialNo: startSerialNo,
        globalEndSerialNo: endSerialNo,
        lineManagers: [
          {
            lineManagerId: session.user._id,
            batchStartSerialNo: startSerialNo,
            batchEndSerialNo: endSerialNo,
            unitsCreated,
            utcTimestamp: new Date(),
          },
        ],
        utcTimestamp: new Date(),
      });

      await batch.save({ session: mongoSession });
    }

    product.batchIds.push(batch._id);
    await product.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return NextResponse.json(
      {
        success: true,
        message: "Task assigned successfully.",
        batch: {
          batchNo: batch.batchNo,
          totalUnits: batch.totalUnits,
          createdUnits: unitsCreated,
          globalStartSerialNo: batch.globalStartSerialNo,
          globalEndSerialNo: batch.globalEndSerialNo,
          lineManagersCount: batch.lineManagers.length,
          endSerialNo,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning task:", error);
    await mongoSession.abortTransaction();
    mongoSession.endSession();

    return NextResponse.json(
      {
        success: false,
        message: "Error assigning task. Please try again.",
      },
      { status: 500 }
    );
  }
}


//get api
export async function GET(request){
console.log("The api is hit");

  const {searchParams}=new URL(request.url);
  const session=await getServerSession(authOptions);
  console.log("The session is",session.user);
  
  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated or user ID missing" },
      { status: 401 }
    );
  }
  const productId=searchParams.get('taskId');
  console.log("The product id in api is",productId);
  
 if(!productId){
    return NextResponse.json({
     sucess:false,
     message:'Cannot find the product Id'
    },{
      status:404
    })
 }
 try {
  await dbConnect();
  
  const batches=await Batch.find({productId});
  console.log("The batches are",batches);
  
 const result=batches.map(
  batch=>{
  const  matchingLineManagers=batch.lineManagers.filter(
      lm=>lm.lineManagerId.toString()===session.user._id
    );
    if(matchingLineManagers.length>0){
      return{
        batchNo: batch.batchNo,
            lineManagers: matchingLineManagers.map(lm => ({
              batchStartSerialNo: lm.batchStartSerialNo,
              batchEndSerialNo: lm.batchEndSerialNo,
              unitsCreated: lm.unitsCreated,
              utcTimestamp: lm.utcTimestamp,
      }))
    };
  }
  return null;
}
 ).filter(Boolean);
 console.log("The result in api is",result);
 return NextResponse.json({
  success: true,
  data: result,
});
 } catch (error) {
  console.error(error);
  return NextResponse.json({
    success:false,
    message:'Server Error',
  },{
    status:500
  })
 }
  //based on task.product id find product and then in that search for all the batches then create an array of batches with those line managers and display the info inside
  
}