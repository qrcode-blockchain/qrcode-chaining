import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        isConnected = db.connections[0].readyState;
        console.log("connected successfully");
    } catch (error) {
        console.error("connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
