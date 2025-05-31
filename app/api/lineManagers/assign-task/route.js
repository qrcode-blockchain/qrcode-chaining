import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { dbConnect } from "../../../../lib/dbConnect";
import Manufacturer from '../../../../model/Manufacturer'
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
    const data =await request.json();
    console.log("Received Data:", data);
    const {manufacturerId,lineManager,location,productName,productPrice,TotalNoOfUnits,useBlockchain}=data;
    if(!productPrice || !productName){
        return NextResponse.json({
            success:false,
            message:"All required fields must be filled"
        },{status:400});
    }
    const existingProductId= await Product.findOne({name:productName,manufacturerId:manufacturerId})
    if(existingProductId){
      const newTask=new Task({
        manufacturer:manufacturerId,
        lineManagerId:lineManager,
        productId:existingProductId,
        location,
        productName,
        productPrice,
        TotalNoOfUnits,
        useBlockchain
      })
      await newTask.save();
    }else{
      const newproduct=new Product({
        name:productName,
        manufacturerId,
        location,
        price:productPrice,
    })
    await newproduct.save();
    const newTask=new Task({
      manufacturer:manufacturerId,
      lineManagerId:lineManager,
      productId:newproduct._id,
      location,
      productName,
      productPrice,
      TotalNoOfUnits,
      useBlockchain
    })
    await newTask.save();
    }
    
      
     
     
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

//useBlockchain Api



// export async function GET(){
//     console.log("The api in backend is being hit");
    
//     await dbConnect();
//     const session= await getServerSession(authOptions);
//     console.log("THE SESSION IS",session);
    
//     if(!session || !session.user || !session.user._id){
//         return NextResponse.json(
//             {success:false,message:"Session not present"},
//             {status:401}
//         );
//     }

//     const manufacturerId=session.user._id;
//     console.log("The manu id is",manufacturerId);
    
//     try {
//         const manufacturer=await Manufacturer.findById(manufacturerId);
//         console.log("The manufacturer in api is",manufacturer);
        
//         if (!manufacturer) {
//             return NextResponse.json(
//                 { success: false, message: "Manufacturer not found" },
//                 { status: 404 }
//             );
//         }
        
        
//         return NextResponse.json({
//             success: true,
//             preferences: {
//                 useBlockchain: manufacturer.useBlockchain || false
//                 // Add other preferences here as needed
//             }
//         });

//     } catch (error) {
//         console.error("Error fetching manufacturer preferences:", error);
//         return NextResponse.json(
//             { success: false, message: "Failed to fetch preferences" },
//             { status: 500 }
//         );
//     }
// }

// export async function PUT(request){
//     await dbConnect();
//     const session =await getServerSession(authOptions);

//     if(!session || !session.user || !session.user._id){
//         return NextResponse.json(
//             {success:false},
//         {status:401}
//         );
//     }

//     const body=await request.json();
//     const {useBlockchain}=body;
    
//     if (typeof useBlockchain !== 'boolean') {
//         return NextResponse.json(
//             { success: false, message: "Invalid request: useBlockchain must be a boolean" },
//             { status: 400 }
//         );
//     }
// const manufacturerId=session.user._id;
//     try {
//         const updatedManufacturer=await Manufacturer.findByIdAndUpdate(
//             manufacturerId,
//             {$set:{useBlockchain}},
//             {new:true}
//         )
//         if(!updatedManufacturer){
//             return NextResponse.json(
//                 {success:false,message:"Manufacturer not found"},
//                 {status:404}
//             );
//         }
//         return NextResponse.json({
//             success:true,
//             message:"Blockchain preference has been updated successfully",
//             preferences:{
//                 useBlockchain:updatedManufacturer.useBlockchain
//             }
//         })
//     } catch (error) {
//         console.error("Error updating manufacturer preferences:", error);
//         return NextResponse.json(
//             { success: false, message: "Failed to update preferences" },
//             { status: 500 }
//         ); 
//     }
// }