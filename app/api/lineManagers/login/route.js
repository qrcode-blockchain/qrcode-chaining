import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import Manufacturer from '../../../../model/Manufacturer';

export async function POST(request) {
    await dbConnect();

    try {
        const data = await request.json();
        const { email, password } = data;

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Email and password are required"
            }, { status: 400 });
        }

        // Find the manufacturer that has this line manager
        const manufacturer = await Manufacturer.findOne({
            "lineManagers.email": email
        });

        if (!manufacturer) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Find the line manager in the manufacturer's lineManagers array
        const lineManager = manufacturer.lineManagers.find(lm => lm.email === email);
        
        if (!lineManager) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, lineManager.password);
        
        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Check if the line manager needs to set a new password (isSet = false means it's still using temp password)
        if (!lineManager.isSet) {
            return NextResponse.json({
                success: true,
                needsTempPassword: true,
                message: "Temporary password login successful. Please set a new password."
            });
        }

        // Create session or token (simplified here, you might want to use JWT or other auth methods)
        // This is a simplified example - in a real app, you'd create a proper session or JWT token
        return NextResponse.json({
            success: true,
            message: "Login successful",
            lineManager: {
                name: lineManager.name,
                email: lineManager.email,
                manufacturerId: manufacturer._id
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        }, { status: 500 });
    }
}