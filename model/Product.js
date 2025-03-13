import mongoose from "mongoose";

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
    serialNo: {
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
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be at least 1"]
    },
    location: {
        type: String,
        required: [true, "Location is Required"],

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);