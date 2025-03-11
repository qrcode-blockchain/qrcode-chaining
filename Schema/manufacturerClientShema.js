import { z } from "zod";

export const ManufacturerClientSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z
        .string()
        .length(10, { message: "Phone number must be exactly 10 digits" })
        .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/, {
            message: "Password must contain at least one uppercase letter, one number, and one special character",
        }),
    address: z.string().min(10).max(200),
    gstNumber: z
        .string()
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
            message: "Invalid GST number format",
        }),
    manufacturingLicenseNumber: z.string().min(1),
    panNumber: z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "Invalid PAN number format" }),
    cinNumber: z
        .string()
        .regex(/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, {
            message: "Invalid CIN number format",
        }),
    productsManufactured: z.string().min(1),
    website: z.string().url().optional(),

    // ✅ Handle file uploads as File objects instead of strings/ObjectId
    gstCertificate: z.any().optional(),
    manufacturingLicenseCertificate: z.any().optional(),
    panNumberCertificate: z.any().optional(),
    cinCertificate:z.any().optional(),
    companyLogo: z.any().optional(),
    businessCertificate: z.any().optional(),
});
