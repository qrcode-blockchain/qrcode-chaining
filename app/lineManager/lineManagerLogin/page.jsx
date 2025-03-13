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

// Temp Password Verification Schema
const TempPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  tempPassword: z.string().min(1, { message: "Temporary password is required" }),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.newPassword || data.confirmPassword) {
    if (!data.newPassword || data.newPassword.length < 8) {
      ctx.addIssue({
        path: ['newPassword'],
        message: "Password must be at least 8 characters"
      });
    }
    if (!/[A-Z]/.test(data.newPassword || '')) {
      ctx.addIssue({
        path: ['newPassword'],
        message: "Must contain at least one uppercase letter"
      });
    }
    if (!/[a-z]/.test(data.newPassword || '')) {
      ctx.addIssue({
        path: ['newPassword'],
        message: "Must contain at least one lowercase letter"
      });
    }
    if (!/[0-9]/.test(data.newPassword || '')) {
      ctx.addIssue({
        path: ['newPassword'],
        message: "Must contain at least one number"
      });
    }
    if (!/[^A-Za-z0-9]/.test(data.newPassword || '')) {
      ctx.addIssue({
        path: ['newPassword'],
        message: "Must contain at least one special character"
      });
    }
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: "Passwords do not match"
      });
    }
  }
});

const LineManagerAuth = () => {
  const [mode, setMode] = useState('login'); // Changed default to login
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const { toast } = useToast();

  // Login Form
  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' }
  });

  // Temporary Password Form
  const tempPassForm = useForm({
    resolver: zodResolver(TempPasswordSchema),
    defaultValues: { email: '', tempPassword: '', newPassword: '', confirmPassword: '' }
  });

  // Handle mode switching with proper form reset
  const switchToLogin = () => {
    loginForm.reset({ email: '', password: '' });
    setMode('login');
  };

  const switchToTempPassword = () => {
    tempPassForm.reset({ email: '', tempPassword: '', newPassword: '', confirmPassword: '' });
    setIsVerified(false);
    setMode('tempPassword');
  };

  // Handle Login
  const onLoginSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/lineManagers/login', data);
      if (response.data.needsTempPassword) {
        tempPassForm.reset();
        tempPassForm.setValue('email', data.email);
        setMode('tempPassword');
        toast({ title: 'Temporary password required', description: 'Enter your temp password and set a new one.' });
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

      setIsVerified(true);
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
      await axios.post('/api/lineManagers/set-new-password', data);
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
          {mode === 'login' ? "Line Manager Login" : "Verify & Set Password"}
        </h1>

        {mode === 'login' ? (
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
        ) : (
          <Form {...tempPassForm}>
            <form onSubmit={tempPassForm.handleSubmit(isVerified ? onNewPasswordSubmit : onTempPassSubmit)} className="space-y-4">
              <FormField
                name="email"
                control={tempPassForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} disabled={isVerified} /></FormControl>
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
                    <FormControl><Input type="password" {...field} disabled={isVerified} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isVerified && (
                <>
                  <FormField
                    name="newPassword"
                    control={tempPassForm.control}
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
                    control={tempPassForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? (isVerified ? "Updating Password..." : "Verifying...") : (isVerified ? "Set Password" : "Verify")}
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