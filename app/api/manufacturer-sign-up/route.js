import { NextResponse } from 'next/server';
import dbConnect from "../lib/dbConnect";
import { sendVerificationEmail } from '../helpers/sendVerification';
import bcrypt from 'bcryptjs';
import manufacturerModel from '../model/Manufacturer';


// Utility function to convert File to Buffer
async function fileToBuffer(formData, fieldName) {
  const file = formData.get(fieldName);
  if (!file || !(file instanceof File)) return null;
  
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const phoneNumber = formData.get('phoneNumber');
    const address = formData.get('address');
    const gstNumber = formData.get('gstNumber');
    const manufacturingLicenseNumber = formData.get('manufacturingLicenseNumber');
    const panNumber = formData.get('panNumber');
    const cinNumber = formData.get('cinNumber');
    const productsManufactured = formData.get('productsManufactured');
    const website = formData.get('website');

    // Basic validation
    if (!name || !email || !password || !phoneNumber || !address || !gstNumber || 
        !manufacturingLicenseNumber || !panNumber || !cinNumber || !productsManufactured) {
      return NextResponse.json({
        success: false,
        message: "All required fields must be filled"
      }, { status: 400 });
    }

    // Convert files to buffers
    const companyLogoBuffer = await fileToBuffer(formData, 'companyLogo');
    const businessCertificateBuffer = await fileToBuffer(formData, 'businessCertificate');

    if (!companyLogoBuffer || !businessCertificateBuffer) {
      return NextResponse.json({
        success: false,
        message: "Company logo and business certificate are required"
      }, { status: 400 });
    }

    // Check for existing verified manufacturer
    const existingManufacturer = await manufacturerModel.findOne({
      email,
      isVerified: true
    });

    if (existingManufacturer) {
      return NextResponse.json({
        success: false,
        message: "A manufacturer with this email already exists"
      }, { status: 400 });
    }

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for existing unverified manufacturer
    const existingUnverifiedManufacturer = await manufacturerModel.findOne({
      email,
      isVerified: false
    });

    if (existingUnverifiedManufacturer) {
      // Update existing unverified manufacturer
      existingUnverifiedManufacturer.name = name;
      existingUnverifiedManufacturer.password = hashedPassword;
      existingUnverifiedManufacturer.phoneNumber = phoneNumber;
      existingUnverifiedManufacturer.address = address;
      existingUnverifiedManufacturer.gstNumber = gstNumber;
      existingUnverifiedManufacturer.manufacturingLicenseNumber = manufacturingLicenseNumber;
      existingUnverifiedManufacturer.panNumber = panNumber;
      existingUnverifiedManufacturer.cinNumber = cinNumber;
      existingUnverifiedManufacturer.productsManufactured = productsManufactured;
      existingUnverifiedManufacturer.website = website || '';
      existingUnverifiedManufacturer.companyLogo = companyLogoBuffer;
      existingUnverifiedManufacturer.businessCertificate = businessCertificateBuffer;
      existingUnverifiedManufacturer.verifyCode = verifyCode;
      existingUnverifiedManufacturer.verifyCodeExpiry = verifyCodeExpiry;

      await existingUnverifiedManufacturer.save();
    } else {
      // Create new manufacturer
      const newManufacturer = new manufacturerModel({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        gstNumber,
        manufacturingLicenseNumber,
        panNumber,
        cinNumber,
        productsManufactured,
        website: website || '',
        companyLogo: companyLogoBuffer,
        businessCertificate: businessCertificateBuffer,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false
      });

      await newManufacturer.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      name,
      email,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to send verification email"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Manufacturer registered successfully. Please verify your email."
    }, { status: 200 });

  } catch (error) {
    console.error('Error in manufacturer registration:', error);
    return NextResponse.json({
      success: false,
      message: "Error registering manufacturer. Please try again."
    }, { status: 500 });
  }
}

// Optional: Handle GET request
export async function GET() {
  return NextResponse.json({
    success: false,
    message: "Method not allowed"
  }, { status: 405 });
}       