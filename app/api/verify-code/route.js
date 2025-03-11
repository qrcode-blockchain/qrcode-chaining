import dbConnect from "../../../lib/dbConnect";

import manufacturerModel from '../../../model/Manufacturer'
export async function POST(request){
    await dbConnect()

    try {
       const {name,code} =await request.json()

      const decodedname= decodeURIComponent(name)
     console.log("The decoded name is",decodedname);
     
      const manufacturer=await manufacturerModel.findOne({
        name:decodedname
      })
      if(!manufacturer){
        return Response.json({
            success:false,
            message:"User not found"
        },{
            status:500
        })
      }
      const isCodeValid=manufacturer.verifyCode===code
      const isCodeNotExpired=new Date(manufacturer.verifyCodeExpiry)>new Date()

      if(isCodeValid && isCodeNotExpired){
        manufacturer.isVerified=true
        await manufacturer.save()
        return Response.json({
            success:true,
            message:"Manufacturer verified"
        },{
            status:200
        })
      }else if(!isCodeNotExpired)
      {
        return Response.json({
            success:false,
            message:"Code Expired.Please signup again to get a new code"
        },{
            status:400
        })
      }else{
        return Response.json({
            success:false,
            message:"Incorrect verification code"
        },{
            status:500
        })
      }
    } catch (error) {
        console.error("Error verifying user");
        return Response.json({
            success:false,
            message:"Error verifying the user"
        },
    {
        status:500
    })
    }
}