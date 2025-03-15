import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

const connection = {};
let gridFsBucket = null;

// This function should only be called on the server side
async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database is connected successfully");
    
    // Initialize GridFS once connection is established
    gridFsBucket = new GridFSBucket(mongoose.connections[0].db, {
      bucketName: "uploads"
    });
    
    console.log("GridFS initialized successfully");
  } catch (error) {
    console.log("Database connection failed", error);
    throw error; // Better to throw than exit process in a web app
  }
}

// Function to get GridFS bucket after connection
function getGridFsBucket() {
  if (!gridFsBucket) {
    throw new Error("Database connection not established yet");
  }
  return gridFsBucket;
}

export { dbConnect, getGridFsBucket };