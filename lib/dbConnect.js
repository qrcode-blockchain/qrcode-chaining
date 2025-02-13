import { log } from "console";
import mongoose from "mongoose";



const connection={}

async  function dbConnect(){
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }
    try{
        const db=await mongoose.connect(process.env.MONGODB_URI || '',{})
        console.log(db);
        console.log(db.connections[0]);
        
        connection.isConnected=db.connections[0].readyState
        console.log("Database is connected successfully");
    }catch(error){
        console.log("Database connection failed",error);
        process.exit(1)        
    }
}

export default dbConnect;
