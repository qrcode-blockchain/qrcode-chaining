import mongoose from "mongoose";

const ManufacturerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Manufacturer's name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    gstNumber: {
        type: String,
        required: [true, "GST Number is required"],
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please enter a valid GST number"]
    },
    manufacturingLicenseNumber: {
        type: String,
        required: [true, "Manufacturing License Number is required"]
    },
    panNumber: {
        type: String,
        required: [true, "PAN Number is required"],
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"]
    },
    cinNumber: {
        type: String,
        required: [true, "CIN Number is required"],
        match: [/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, "Please enter a valid CIN number (21 characters)"]
    },
    productsManufactured: {
        type: [String],
        required: [true, "Type of Products Manufactured is required"]
    },
    companyLogo: {
        type: Buffer,  // Store the URL/path of the uploaded file
        required: true
    },
    businessCertificate: {
        type: Buffer,  // Store the URL/path of the uploaded file
        required: true
    },
    website: {
        type: String,
        required: false,
        match: [/^(https?:\/\/)?([\w\d.-]+)\.([a-z]{2,6})([\/\w .-]*)*\/?$/, "Please enter a valid URL"]
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"],
       },
       verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"],
       },
       isVerified:{
        type:Boolean,
        default:false,
       },
}, {
    timestamps: true
});

const Manufacturer = mongoose.models.Manufacturer || mongoose.model('Manufacturer', ManufacturerSchema);

module.exports = Manufacturer;