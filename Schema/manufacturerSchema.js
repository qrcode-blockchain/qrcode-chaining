
import {z} from "zod";
import { ObjectId } from "mongodb";
export const LineManagerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" })
  });
export const ManufacturerServerSchema = z.object({
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

    // ✅ GridFS ObjectId validation
    gstCertificate: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid GridFS ObjectId" }),
    manufacturingLicenseCertificate: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid GridFS ObjectId" }),
    panNumberCertificate: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid GridFS ObjectId" }),
    cinCertificate: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid GridFS ObjectId" }),
    companyLogo: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid GridFS ObjectId" }),
    businessCertificate: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid GridFS ObjectId" }),
//line manager
    lineManagers: z
    .array(
        z.object({
            name: z.string().min(1, { message: "Line Manager's name is required" }),
            email: z.string().email({ message: "Invalid email address" }),
        })
    )
    .optional(),
});
