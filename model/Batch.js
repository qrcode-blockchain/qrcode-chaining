import mongoose from "mongoose";

const lineManagerSchema = new mongoose.Schema({
  lineManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LineManager',
    required: true
  },
  batchStartSerialNo: {
    type: Number,
    required: true
  },
  batchEndSerialNo: {
    type: Number,
    required: true
  },
  unitsCreated: {
    type: Number,
    required: true
  },
  utcTimestamp: {
    type: Date,
    required: true
  }
}, { _id: false });

const batchSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  batchNo: {
    type: String,
    required: true
  },
  utcTimestamp: {
    type: Date,
    default: Date.now // Only used for manufacturer batches
  },
  totalUnits: {
    type: Number,
    required: true
  },
  globalStartSerialNo: {
    type: Number,
    required: true
  },
  globalEndSerialNo: {
    type: Number,
    required: true
  },
  lineManagers: {
    type: [lineManagerSchema],
    default: undefined // This keeps it optional
  }
});

export default mongoose.models.Batch || mongoose.model("Batch", batchSchema);