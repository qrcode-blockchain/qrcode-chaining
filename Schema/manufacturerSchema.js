import { z } from 'zod';

export const fileSchema = z
  .instanceof(File,{message:'Input must be a file'})
  .refine((file) => {
    console.log('File type:', file);
    console.log('File instance check:', file instanceof File);
    return file.size > 0, { 

    message: 'File cannot be empty' 
  }})
  .refine(
    (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), 
    { message: 'Invalid file type. Only JPEG, PNG, and PDF are allowed.' }
  )

export const ManufacturerSignUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    
    email: z
        .string()
        .email({ message: "Invalid email address" }),
    
    phoneNumber: z
        .string()
        .length(10, { message: "Phone number must be exactly 10 digits" })
        .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
    
        password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/,
            { message: "Password must contain at least one uppercase letter, one number, and one special character" }
        ),
    
    address: z
        .string()
        .min(10, { message: "Address must be at least 10 characters long" })
        .max(200, { message: "Address cannot exceed 200 characters" }),
    
    gstNumber: z
        .string()
        .regex(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 
            { message: "Invalid GST number format" }
        ),
        gstCertificate: fileSchema,

    manufacturingLicenseNumber: z
        .string()
        .min(1, { message: "Manufacturing license number is required" }),
    manufacturingLicenseCertificate:fileSchema,
    panNumber: z
        .string()
        .regex(
            /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            { message: "Invalid PAN number format" }
        ),
    panNumberCertificate:fileSchema,
    cinNumber: z
        .string()
        .regex(
            /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
            { message: "Invalid CIN number format (must be 21 characters)" }
        ),
    cinCertificate:fileSchema,
    productsManufactured: 
            z.string().min(1, { message: "Product name cannot be empty" })
        
        .min(1, { message: "At least one product must be specified" }),
    
    companyLogo: fileSchema,
    
    businessCertificate:fileSchema,
    
    website: z
    .string()
    .url({ message: "Invalid website URL" })
    .optional() // allows undefined
    .refine(value => value === "" || value !== "", { message: "Invalid website URL" }) // explicitly allow empty string if needed
});