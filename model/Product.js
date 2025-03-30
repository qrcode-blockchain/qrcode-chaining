import mongoose from "mongoose";
import { deflate } from "zlib";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    batchNo: {
        type: String,
        required: [true, "Batch number is required"],
    },
    startSerialNo: {
        type: Number,
        required: [true, "Serial number is required"],
    },
    endSerialNo: {
        type: Number,
        required: [true, "Serial number is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    NoOfUnits: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be at least 1"]
    },
    location: {
        type: String,
        required: [true, "Location is Required"],

    },
    generatedHash:{
       type:String,
       default:false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
