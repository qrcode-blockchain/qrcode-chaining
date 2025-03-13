import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Manufacturer from '../../../../model/Manufacturer';

export async function POST(request) {
    await dbConnect();

    try {
        const data = await request.json();
        const { email, tempPassword } = data;

        // Basic validation
        if (!email || !tempPassword) {
            return NextResponse.json({
                success: false,
                message: "Email and temporary password are required"
            }, { status: 400 });
        }

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

        const lineManager = manufacturer.lineManagers[lineManagerIndex];

        // Check if the line manager's password is already set (not using temp password)
        if (lineManager.isSet) {
            return NextResponse.json({
                success: false,
                message: "Your account is already set up. Please use the regular login."
            }, { status: 400 });
        }

        // Verify the temporary password
        const isPasswordValid = await bcrypt.compare(tempPassword, lineManager.password);
        
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid temporary password"
            }, { status: 401 });
        }

        // Return success if temporary password is verified
        return NextResponse.json({
            success: true,
            message: "Temporary password verified successfully",
            verified: true
        });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        }, { status: 500 });
    }
}