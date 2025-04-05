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
  }
}, {
  timestamps: true // includes createdAt and updatedAt
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);