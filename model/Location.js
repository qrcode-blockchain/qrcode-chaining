import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        googleMapsLink: {
            type: String
        },
        pageUrl: {
            type: String
        },
        manufacturerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manufacturer',
            required: true
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        }
    }, {
        timestamps: true
    }
);

export default mongoose.models.Location || mongoose.model("Location", locationSchema);