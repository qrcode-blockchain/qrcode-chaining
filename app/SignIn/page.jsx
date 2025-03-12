'use client';
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useFormField,
} from '../../components/ui/form';
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '../../hooks/useToast';
import { signInSchema } from '../../Schema/signInSchema';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // const handleGoogleSignin = () => {
  //   signIn('google', {
  //     callbackUrl: '/dashboard'
  //   });
  // };

  const { toast } = useToast();
  
  const onSubmit = async (data) => {
    console.log("Form Data",data);
    setIsSubmitting(true);
    try {
      console.log("The data in signin is",data.identifier);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: data.identifier,
        password: data.password,
      });
        console.log((result));
        
      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } else if (result?.url) {
        router.replace('/Dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-400/20 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Welcome Back to True Feedback
          </h1>
          <p className="text-gray-300">
            Sign in to continue your secret conversations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center">
                    <Mail className="mr-2 text-blue-400" size={20} />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/10 border border-blue-400/20 text-white placeholder:text-gray-400"
                      placeholder="Enter your email or username"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center">
                    <Lock className="mr-2 text-blue-400" size={20} />
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="bg-white/10 border border-blue-400/20 text-white placeholder:text-gray-400"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* <Button
              type="button"
              onClick={handleGoogleSignin}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition duration-300 border border-blue-400/20"
            >
              Sign In with Google
            </Button> */}
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-gray-300">
            Not a member yet?{' '}
            <Link 
              href="/ManufacturerSignup" 
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}