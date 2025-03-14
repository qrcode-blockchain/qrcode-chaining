'use client'
import React, { useState, useEffect } from "react";
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

// Simplified schemas for debugging
const LoginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

const TempPasswordSchema = z.object({
  email: z.string().min(1, "Email is required"),
  tempPassword: z.string().min(1, "Temporary password is required"),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional()
});

const LineManagerAuth = () => {
  const [mode, setMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ formValues: {}, formState: {} });
  
  const { toast } = useToast();

  // Login Form
  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange'
  });

  // Temporary Password Form - with simplified validation
  const tempPassForm = useForm({
    resolver: zodResolver(TempPasswordSchema),
    defaultValues: { email: '', tempPassword: '', newPassword: '', confirmPassword: '' },
    mode: 'onChange'
  });

  // Debug monitoring
  useEffect(() => {
    const subscription = tempPassForm.watch((value) => {
      setDebugInfo(prev => ({
        ...prev,
        formValues: value,
        formState: {
          isDirty: tempPassForm.formState.isDirty,
          isValid: tempPassForm.formState.isValid,
          errors: tempPassForm.formState.errors
        }
      }));
    });
    
    return () => subscription.unsubscribe();
  }, [tempPassForm, tempPassForm.watch]);

  // Direct value handler for debugging
  const handleDirectInput = (e) => {
    tempPassForm.setValue('tempPassword', e.target.value, { shouldValidate: true });
  };

  const switchToLogin = () => {
    loginForm.reset({ email: '', password: '' });
    setMode('login');
  };

  const switchToTempPassword = () => {
    tempPassForm.reset({ email: 'test@example.com', tempPassword: '', newPassword: '', confirmPassword: '' });
    setIsVerified(false);
    setMode('tempPassword');
  };

  // Simplified handlers for debugging
  const onLoginSubmit = (data) => {
    toast({ title: "Login attempt", description: JSON.stringify(data) });
    // Simulate success
    tempPassForm.reset();
    tempPassForm.setValue('email', data.email);
    setMode('tempPassword');
  };

  const onTempPassSubmit = (data) => {
    toast({ title: "Temp password verification", description: JSON.stringify(data) });
    // Simulate success
    setIsVerified(true);
  };

  const onNewPasswordSubmit = (data) => {
    toast({ title: "New password set", description: JSON.stringify(data) });
    // Simulate success
    loginForm.reset();
    setMode('login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-blue-900 p-8 rounded-lg w-full max-w-md mb-4">
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6">
                Login
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
          <>
            <Form {...tempPassForm}>
              <form onSubmit={tempPassForm.handleSubmit(isVerified ? onNewPasswordSubmit : onTempPassSubmit)} className="space-y-4">
                <FormField
                  name="email"
                  control={tempPassForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Regular Form Field for temp password */}
                <FormField
                  name="tempPassword"
                  control={tempPassForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporary Password (Regular Field)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Native input for debugging */}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">
                    Temporary Password (Direct Input)
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 text-white p-2 w-full rounded"
                    value={tempPassForm.watch('tempPassword')}
                    onChange={handleDirectInput}
                  />
                  <span className="text-sm text-gray-400 mt-1 block">
                    Try typing here if the above field doesn't work
                  </span>
                </div>

                {isVerified && (
                  <>
                    <FormField
                      name="newPassword"
                      control={tempPassForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Button type="submit" className="w-full mt-6">
                  {isVerified ? "Set Password" : "Verify"}
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
          </>
        )}
      </div>
      
      {/* Debug Panel */}
      
    </div>
  );
};

export default LineManagerAuth;