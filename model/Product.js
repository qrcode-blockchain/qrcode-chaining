import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manufacturer',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    batchIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    }],
    generatedHash: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    }
    }, {
    timestamps: true // includes createdAt and updatedAt
});
productSchema.index({name:1,manufacturer:1},{unique:true});
export default mongoose.models.Product || mongoose.model("Product", productSchema);