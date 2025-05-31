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
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
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
    TotalNoOfUnits: {
        type: Number,
        required: true,
        min: 1,
    },
    completedUnits:{
        type:Number,
       default:0,
        min:0
    },
    startSerialNo: {
        type: Number,
        default:1,
        required: true,
      },
      endSerialNo: {
        type: Number,
        default: null, // Will be calculated and updated as batches are completed
      },
    useBlockchain: {
        type: Boolean,
        default: false,
        
    },
 
    assignedAt: {
        type: Date,
        default: Date.now,
    },
    status:{
        type:String,
        enum:["Not Started","pending","in-progress","completed"],
        default:"Not Started",
    }
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;
