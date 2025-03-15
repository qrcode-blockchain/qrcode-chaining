import {dbConnect} from "../../../lib/dbConnect";

import Manufacturer from '../../../model/Manufacturer'
export async function POST(request){
    await dbConnect()

    try {
       const {email,code} =await request.json()

    //   const decodedname= decodeURIComponent(name)
    //  console.log("The decoded name is",decodedname);
     console.log("The meial in api is",email);
        const decodedemail= decodeURIComponent(email);
        console.log("The decode in api is",email);
      const manufacturer=await Manufacturer.findOne({
        email:decodedemail
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
      const currentTime = Date.now();
      const expiryTime = new Date(manufacturer.verifyCodeExpiry).getTime();
      const isCodeNotExpired = expiryTime > currentTime;
      console.log({
        currentTime: new Date().toISOString(),
        expiryTime: new Date(manufacturer.verifyCodeExpiry).toISOString(),
        isExpired: new Date(manufacturer.verifyCodeExpiry).getTime() <= Date.now()
      });
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