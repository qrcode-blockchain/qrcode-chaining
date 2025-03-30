import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Manufacturer from '../../../../model/Manufacturer';
import * as z from 'zod';

// Password Schema Validation
const PasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  tempPassword: z.string().min(1, { message: "Temporary password is required" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(request) {
    await dbConnect();

    try {
        const data = await request.json();
        
        // Validate the data using Zod schema
        const validation = PasswordSchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid data",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const { email, tempPassword, newPassword } = data;

        // Find the manufacturer that has this line manager
        const manufacturer = await Manufacturer.findOne({
            "lineManagers.email": email
        });

        if (!manufacturer) {
            return NextResponse.json({
                success: false,
                message: "Line manager not found"
            }, { status: 404 });
        }

        // Find the line manager in the manufacturer's lineManagers array
        const lineManagerIndex = manufacturer.lineManagers.findIndex(lm => lm.email === email);
        
        if (lineManagerIndex === -1) {
            return NextResponse.json({
                success: false,
                message: "Line manager not found"
            }, { status: 404 });
        }

        // Get the line manager
        const lineManager = manufacturer.lineManagers[lineManagerIndex];

        // Verify the temporary password first
        const isPasswordValid = await bcrypt.compare(tempPassword, lineManager.password);
        
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid temporary password"
            }, { status: 401 });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the line manager's password and set isSet to true

        manufacturer.lineManagers[lineManagerIndex].password = hashedNewPassword;
        manufacturer.lineManagers[lineManagerIndex].isSet = true;

        // Save the updated manufacturer document
        await manufacturer.save();

        return NextResponse.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        }, { status: 500 });
    }
}