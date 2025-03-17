'use client'
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../../hooks/useToast';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../../../components/ui/form";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

// Login Schema
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" })
});

// Temp Password Schema - Simplified
const TempPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  tempPassword: z.string().min(1, { message: "Temporary password is required" })
});

// New Password Schema
const NewPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const LineManagerAuth = () => {
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Login Form
  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
  });

  // Temporary Password Form
  const tempPassForm = useForm({
    resolver: zodResolver(TempPasswordSchema),
    defaultValues: { email: '', tempPassword: '' }
  });

  // New Password Form
  const newPasswordForm = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { email: '', newPassword: '', confirmPassword: '' }
  });

  // Handle mode switching with proper form reset
  const switchToLogin = () => {
    loginForm.reset();
    setMode('login');
  };

  const switchToTempPassword = () => {
    tempPassForm.reset();
    setMode('tempPassword');
  };

  // Handle Login
  const onLoginSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/lineManagers/login', data);
      if (response.data.needsTempPassword) {
        tempPassForm.setValue('email', data.email);
        setMode('tempPassword');
        toast({ title: 'Temporary password required', description: 'Enter your temp password to continue.' });
      } else {
        window.location.href = '/lineManager/lineManagerDash';
      }
    } catch (error) {
      toast({ title: "Login failed", description: error.response?.data?.message || "Invalid credentials", variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Temporary Password Verification
  const onTempPassSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/lineManagers/verify-temp-password', {
        email: data.email,
        tempPassword: data.tempPassword
      });

      // Transfer email to new password form
      newPasswordForm.setValue('email', data.email);
      setMode('newPassword');
      toast({ title: 'Verification successful', description: 'You can now set a new password.' });
    } catch (error) {
      toast({ title: "Verification failed", description: error.response?.data?.message || "Invalid temporary password", variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle New Password Submission
  const onNewPasswordSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/lineManagers/set-new-password', {
        email: data.email,
        tempPassword: tempPassForm.getValues().tempPassword, // Pass the temp password from previous form
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      toast({ title: 'Password updated', description: 'You can now log in with your new password.' });
      loginForm.reset();
      setMode('login');
    } catch (error) {
      toast({ title: "Password update failed", description: error.response?.data?.message || "Could not update password", variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-blue-900 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? "Line Manager Login" : 
           mode === 'tempPassword' ? "Verify Temporary Password" : 
           "Set New Password"}
        </h1>

        {mode === 'login' && (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={loginForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={loginForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <p className="mt-4 text-sm text-gray-300 text-center">
                Don't have credentials?{" "}
                <button 
                  type="button"
                  className="text-blue-400 hover:underline" 
                  onClick={switchToTempPassword}
                >
                  Set up password
                </button>
              </p>
            </form>
          </Form>
        )}

        {mode === 'tempPassword' && (
          <Form {...tempPassForm}>
            <form onSubmit={tempPassForm.handleSubmit(onTempPassSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={tempPassForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="tempPassword"
                control={tempPassForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temporary Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>

              <p className="mt-4 text-sm text-gray-300 text-center">
                Already have credentials?{" "}
                <button 
                  type="button"
                  className="text-blue-400 hover:underline" 
                  onClick={switchToLogin}
                >
                  Login here
                </button>
              </p>
            </form>
          </Form>
        )}

        {mode === 'newPassword' && (
          <Form {...newPasswordForm}>
            <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={newPasswordForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} readOnly /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="newPassword"
                control={newPasswordForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={newPasswordForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? "Setting Password..." : "Set Password"}
              </Button>

              <p className="mt-4 text-sm text-gray-300 text-center">
                Already have credentials?{" "}
                <button 
                  type="button"
                  className="text-blue-400 hover:underline" 
                  onClick={switchToLogin}
                >
                  Login here
                </button>
              </p>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default LineManagerAuth;