'use client'
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/Schema/verifySchema";

import axios from "axios";
import { Shield } from 'lucide-react';


const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log('The name is ',params.name);
      
      const response = await axios.post(`/api/verify-code`, {
        name: params.name,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace('/SignIn');
    } catch (error) {
      console.log("Error in verifying user account");
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-400/20 shadow-2xl p-8">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Verify Your Account
          </h1>
          <p className="text-gray-300">
            Enter the verification code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white mb-2">
              Verification Code
            </label>
            <input
              {...register('code')}
              className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white focus:border-blue-400 focus:ring focus:ring-blue-400/30"
              placeholder="Enter verification code"
            />
            {errors.code && (
              <p className="text-red-400 text-sm mt-1">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;