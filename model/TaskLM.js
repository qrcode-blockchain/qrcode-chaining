import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Manufacturer",  // References Manufacturer model
        required: true,
    },
    lineManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    location: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    NoOfUnits: {
        type: Number,
        required: true,
        min: 1,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
    status:{
        type:String,
        enum:["pending","in-progress","completed"],
        default:"pending",
    }
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;
