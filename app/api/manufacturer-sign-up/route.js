import { NextResponse } from 'next/server';
import dbConnect from "../../../lib/dbConnect";
import { sendVerificationEmail } from '../../../helpers/sendVerification';
import bcrypt from 'bcryptjs';
import manufacturerModel from '../../../model/Manufacturer';

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
    const gstCertificateBuffer=await fileToBuffer(formData,'gstCertificate');
    const manufacturingLicenseCertificateBuffer=await fileToBuffer(formData,'manufacturingLicenseCertificate');
    const panNumberCertificateBuffer=await fileToBuffer(formData,'panNumberCertificate');
    const cinCertificateBuffer=await fileToBuffer(formData,'cinCertificate');
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
      existingUnverifiedManufacturer.gstCertificate=gstCertificateBuffer.toString('base64');
      existingUnverifiedManufacturer.manufacturingLicenseNumber = manufacturingLicenseNumber;
      existingUnverifiedManufacturer.manufacturingLicenseCertificate=manufacturingLicenseCertificateBuffer.toString('base64');
      existingUnverifiedManufacturer.panNumber = panNumber;
      existingUnverifiedManufacturer.panNumberCertificate=panNumberCertificateBuffer.toString('base64');
      existingUnverifiedManufacturer.cinNumber = cinNumber;
      existingUnverifiedManufacturer.cinCertificate=cinCertificateBuffer.toString('base64');
      existingUnverifiedManufacturer.productsManufactured = productsManufactured;
      existingUnverifiedManufacturer.website = website || '';
      existingUnverifiedManufacturer.companyLogo =  companyLogoBuffer.toString('base64');
      existingUnverifiedManufacturer.businessCertificate = businessCertificateBuffer.toString('base64');
      existingUnverifiedManufacturer.verifyCode = verifyCode;
      existingUnverifiedManufacturer.verifyCodeExpiry = verifyCodeExpiry;

      await existingUnverifiedManufacturer.save();
    } else {
      // Create new manufacturer
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      console.log("The gst certificate is",gstCertificateBuffer);
      
      const newManufacturer = new manufacturerModel({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        gstNumber,
        gstCertificate:gstCertificateBuffer.toString('base64'),
        manufacturingLicenseNumber,
        manufacturingLicenseCertificate:manufacturingLicenseCertificateBuffer.toString('base64'),
        panNumber,
        panNumberCertificate:panNumberCertificateBuffer.toString('base64'),
        cinNumber,
        cinCertificate:cinCertificateBuffer.toString('base64'),
        productsManufactured,
        website: website || '',
        companyLogo: companyLogoBuffer.toString('base64'),
        businessCertificate: businessCertificateBuffer.toString('base64'),
        verifyCode,
        verifyCodeExpiry:expiryDate,
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
// import { NextResponse } from 'next/server';
// import dbConnect from "../../../lib/dbConnect";
// import { sendVerificationEmail } from '../../../helpers/sendVerification';
// import bcrypt from 'bcryptjs';
// import manufacturerModel from '../../../model/Manufacturer';

// // Utility function to convert File to Buffer
// async function fileToBuffer(formData, fieldName) {
//   const file = formData.get(fieldName);
//   console.log(`Processing file: ${fieldName}, Type: ${typeof file}`);
//   if (!file || !(file instanceof File)) {
//     console.log(`File ${fieldName} is missing or not a valid File instance`);
//     return null;
//   }
  
//   const arrayBuffer = await file.arrayBuffer();
//   console.log(`File ${fieldName} converted to buffer, Size: ${arrayBuffer.byteLength} bytes`);
//   return Buffer.from(arrayBuffer);
// }

// export async function POST(request) {
//   await dbConnect();

//   try {
//     const formData = await request.formData();
//     console.log("Received Form Data:", formData);
    
//     // Extract form fields
//     const name = formData.get('name');
//     const email = formData.get('email');
//     const password = formData.get('password');
//     const phoneNumber = formData.get('phoneNumber');
//     const address = formData.get('address');
//     const gstNumber = formData.get('gstNumber');
//     const manufacturingLicenseNumber = formData.get('manufacturingLicenseNumber');
//     const panNumber = formData.get('panNumber');
//     const cinNumber = formData.get('cinNumber');
//     const productsManufactured = formData.get('productsManufactured');
//     const website = formData.get('website');
    
//     console.log("Extracted Fields:", { name, email, password, phoneNumber, address, gstNumber, manufacturingLicenseNumber, panNumber, cinNumber, productsManufactured, website });
    
//     // Basic validation
//     if (!name || !email || !password || !phoneNumber || !address || !gstNumber || 
//         !manufacturingLicenseNumber || !panNumber || !cinNumber || !productsManufactured) {
//       console.log("Missing required fields");
//       return NextResponse.json({ success: false, message: "All required fields must be filled" }, { status: 400 });
//     }

//     // Convert files to buffers
//     const gstCertificateBuffer = await fileToBuffer(formData, 'gstCertificate');
//     const manufacturingLicenseCertificateBuffer = await fileToBuffer(formData, 'manufacturingLicenseCertificate');
//     const panNumberCertificateBuffer = await fileToBuffer(formData, 'panNumberCertificate');
//     const cinCertificateBuffer = await fileToBuffer(formData, 'cinCertificate');
//     const companyLogoBuffer = await fileToBuffer(formData, 'companyLogo');
//     const businessCertificateBuffer = await fileToBuffer(formData, 'businessCertificate');
    
//     console.log("File Buffers Created:", {
//       gstCertificateBuffer: gstCertificateBuffer?.length,
//       manufacturingLicenseCertificateBuffer: manufacturingLicenseCertificateBuffer?.length,
//       panNumberCertificateBuffer: panNumberCertificateBuffer?.length,
//       cinCertificateBuffer: cinCertificateBuffer?.length,
//       companyLogoBuffer: companyLogoBuffer?.length,
//       businessCertificateBuffer: businessCertificateBuffer?.length
//     });
    
//     if (!gstCertificateBuffer || 
//       !manufacturingLicenseCertificateBuffer || 
//       !panNumberCertificateBuffer || 
//       !cinCertificateBuffer || 
//       !companyLogoBuffer || 
//       !businessCertificateBuffer) {
//     console.log("One or more required certificates are missing");
//     return NextResponse.json({ 
//       success: false, 
//       message: "All certificates are required" 
//     }, { status: 400 });
//   }

//     // Check for existing verified manufacturer
//     const existingManufacturer = await manufacturerModel.findOne({ email, isVerified: true });
//     if (existingManufacturer) {
//       console.log("Manufacturer already exists and is verified");
//       return NextResponse.json({ success: false, message: "A manufacturer with this email already exists" }, { status: 400 });
//     }

//     // Generate verification code
//     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
//     const verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check for existing unverified manufacturer
//     const existingUnverifiedManufacturer = await manufacturerModel.findOne({ email, isVerified: false });
    
//     if (existingUnverifiedManufacturer) {
//       console.log("Updating existing unverified manufacturer");
//       existingUnverifiedManufacturer.name = name;
//       existingUnverifiedManufacturer.password = hashedPassword;
//       existingUnverifiedManufacturer.phoneNumber = phoneNumber;
//       existingUnverifiedManufacturer.address = address;
//       existingUnverifiedManufacturer.gstNumber = gstNumber;
//       existingUnverifiedManufacturer.gstCertificate = gstCertificateBuffer;
//       existingUnverifiedManufacturer.manufacturingLicenseNumber = manufacturingLicenseNumber;
//       existingUnverifiedManufacturer.manufacturingLicenseCertificate = manufacturingLicenseCertificateBuffer;
//       existingUnverifiedManufacturer.panNumber = panNumber;
//       existingUnverifiedManufacturer.panNumberCertificate = panNumberCertificateBuffer;
//       existingUnverifiedManufacturer.cinNumber = cinNumber;
//       existingUnverifiedManufacturer.cinCertificate = cinCertificateBuffer;
//       existingUnverifiedManufacturer.productsManufactured = productsManufactured;
//       existingUnverifiedManufacturer.website = website || '';
//       existingUnverifiedManufacturer.companyLogo = companyLogoBuffer;
//       existingUnverifiedManufacturer.businessCertificate = businessCertificateBuffer;
//       existingUnverifiedManufacturer.verifyCode = verifyCode;
//       existingUnverifiedManufacturer.verifyCodeExpiry = verifyCodeExpiry;
//       await existingUnverifiedManufacturer.save();
      
//     } else {
//       console.log("Creating new manufacturer");
//       const newManufacturer = new manufacturerModel({
//         name, email, password: hashedPassword,
//          phoneNumber,
//           address, 
//           gstNumber,
//         gstCertificate: gstCertificateBuffer,
//         manufacturingLicenseNumber,
//         manufacturingLicenseCertificate: manufacturingLicenseCertificateBuffer,
//         panNumber,
//         panNumberCertificate: panNumberCertificateBuffer,
//         cinNumber,
//         cinCertificate: cinCertificateBuffer,
//         productsManufactured,
//         website: website || '',
//         companyLogo: companyLogoBuffer,
//         businessCertificate: businessCertificateBuffer,
//         verifyCode,
//         verifyCodeExpiry,
//         isVerified: false
//       });
   
    
//      // await newManufacturer.save();
//      await newManufacturer.save();
// console.log("Manufacturer saved successfully");


//     }
    
//     // Send verification email
//     console.log("Sending verification email");
//     const emailResponse = await sendVerificationEmail(name, email, verifyCode);
//     if (!emailResponse.success) {
//       console.log("Email sending failed");
//       return NextResponse.json({ success: false, message: "Failed to send verification email" }, { status: 500 });
//     }
    
//     return NextResponse.json({ success: true, message: "Manufacturer registered successfully. Please verify your email." }, { status: 200 });

//   } catch (error) {
//     console.error('Error in manufacturer registration:', error);
//     return NextResponse.json({ success: false, message: "Error registering manufacturer. Please try again." }, { status: 500 });
//   }
// }
