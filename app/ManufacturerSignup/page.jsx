// 'use client'
// import React, { useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { Upload, Shield, Building2, Globe, Mail, Phone, Lock } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import * as z from 'zod'
// import Link from "next/link";
// import { ManufacturerSignUpSchema } from '@/Schema/manufacturerSchema';
// import axios, { AxiosError } from 'axios'
// import { zodResolver } from '@hookform/resolvers/zod';

// const ManufacturerSignup = () => {
//   const [previewLogo, setPreviewLogo] = useState(null);
//   const {toast}=useToast();
//   const router=useRouter();

//   const { 
//     control, 
//     register, 
//     handleSubmit, 
//     formState: { errors }, 
//     watch 
//   } = useForm({
//     mode: 'onChange',
//     resolver: zodResolver(ManufacturerSignUpSchema),
//     defaultValues: {
//       name:'',
//       email: '',
//       phoneNumber:'',
//       password: '',
//         address: '',
//         gstNumber:'',
//         manufacturingLicenseNumber:'',
//         panNumber:'',
//         cinNumber:'',
//         productsManufactured:'',
//         companyLogo:undefined,
//         businessCertificate:undefined,
//         website:''
      
//       } 
//   });

//   const onSubmit = (data) => {
//     console.log('Signup Data:', data);
//     // Implement your signup logic here
//   };

//   const handleLogoUpload = (event) => {
//     if (!e.target.files || e.target.files.length===0) return;
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewLogo(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-400/20 shadow-2xl p-8 sm:p-12">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
//             Manufacturer Registration
//           </h1>
//           <p className="text-gray-300">
//             Secure your blockchain-enabled manufacturing verification
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Manufacturer Name */}
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Building2 className="mr-2 text-blue-400" size={20} />
//                 Manufacturer Name
//               </label>
//               <input
//                 {...register('manufacturerName', { 
//                   required: 'Manufacturer name is required' 
//                 })}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white focus:border-blue-400 focus:ring focus:ring-blue-400/30"
//                 placeholder="Company or Individual Name"
//               />
//               {errors.manufacturerName && (
//                 <p className="text-red-400 text-sm mt-1">
//                   {errors.manufacturerName.message}
//                 </p>
//               )}
//             </div>

//             {/* Email Address */}
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Mail className="mr-2 text-blue-400" size={20} />
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 {...register('email', { 
//                   required: 'Email is required',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Invalid email address"
//                   }
//                 })}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white focus:border-blue-400 focus:ring focus:ring-blue-400/30"
//                 placeholder="your.email@example.com"
//               />
//               {errors.email && (
//                 <p className="text-red-400 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Phone Number */}
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Phone className="mr-2 text-blue-400" size={20} />
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 {...register('phoneNumber', { 
//                   required: 'Phone number is required',
//                   pattern: {
//                     value: /^[0-9]{10,15}$/,
//                     message: "Invalid phone number"
//                   }
//                 })}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white focus:border-blue-400 focus:ring focus:ring-blue-400/30"
//                 placeholder="+1 (123) 456-7890"
//               />
//               {errors.phoneNumber && (
//                 <p className="text-red-400 text-sm mt-1">
//                   {errors.phoneNumber.message}
//                 </p>
//               )}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Lock className="mr-2 text-blue-400" size={20} />
//                 Password
//               </label>
//               <input
//                 type="password"
//                 {...register('password', { 
//                   required: 'Password is required',
//                   minLength: {
//                     value: 8,
//                     message: "Password must be at least 8 characters"
//                   }
//                 })}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white focus:border-blue-400 focus:ring focus:ring-blue-400/30"
//                 placeholder="Strong password"
//               />
//               {errors.password && (
//                 <p className="text-red-400 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* More Fields... */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2">
//                 Business Registration Number
//               </label>
//               <input
//                 {...register('registrationNumber', { 
//                   required: 'Registration number is required' 
//                 })}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="Enter registration number"
//               />
//             </div>
//             <div>
//               <label className="block text-white mb-2">
//                 GST Number
//               </label>
//               <input
//                 {...register('gstNumber', { 
//                   required: 'GST number is required' 
//                 })}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="Enter GST number"
//               />
//             </div>
//           </div>

//           {/* Logo Upload */}
//           <div>
//             <label className="block text-white mb-2 flex items-center">
//               <Upload className="mr-2 text-blue-400" size={20} />
//               Company Logo/Business Certificate
//             </label>
//             <div className="flex items-center space-x-4">
//               <input
//                 type="file"
//                 accept="image/*"
//                 {...register('companyLogo')}
//                 onChange={handleLogoUpload}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white file:px-4 file:py-2"
//               />
//               {previewLogo && (
//                 <img 
//                   src={previewLogo} 
//                   alt="Logo Preview" 
//                   className="w-20 h-20 object-cover rounded-lg" 
//                 />
//               )}
//             </div>
//           </div>

//           <div className="text-center mt-8">
//             <button 
//               type="submit" 
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 transform hover:scale-105"
//             >
//               Register Manufacturer
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManufacturerSignup;
// 'use client'
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Upload, Shield, Building2, Globe, Mail, Phone, Lock, FileText, CreditCard, Briefcase } from 'lucide-react';
// import { useToast } from "@/hooks/useToast";
// import { useRouter } from "next/navigation";
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ManufacturerSignUpSchema } from '@/Schema/manufacturerSchema';
// import axios from 'axios';

// const ManufacturerSignup = () => {
//   const [previewLogo, setPreviewLogo] = useState(null);
//   const [previewCertificate, setPreviewCertificate] = useState(null);
//   const { toast } = useToast();
//   const router = useRouter();

//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors, isSubmitting }, 
//     watch 
//   } = useForm({
//     mode: 'onChange',
//     resolver: zodResolver(ManufacturerSignUpSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       phoneNumber: '',
//       password: '',
//       address: '',
//       gstNumber: '',
//       manufacturingLicenseNumber: '',
//       panNumber: '',
//       cinNumber: '',
//       productsManufactured: '',
//       companyLogo: undefined,
//       businessCertificate: undefined,
//       website: ''
//     }
//   });

//   const handleFilePreview = (event, setPreview) => {
//     if (!event.target.files || event.target.files.length === 0) return;
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = async (data) => {
//     // Inspect the form data here
 
//     try {
//       console.log("The fucntion has been called");
    
//       console.log("Form data being submitted:", form.getValues());
//       console.log("The data that is being sent for submission is",data);
//       const formData = new FormData();
//       Object.keys(data).forEach(key => {
//         if (key === 'companyLogo' || key === 'businessCertificate') {
//           if (data[key]?.[0]) {
//             formData.append(key, data[key][0]);
//           }
//         }
//       });
//       if (data.companyLogo?.[0]) {
//         formData.append('companyLogo', data.companyLogo[0]);
//       }
//       if (data.businessCertificate?.[0]) {
//         formData.append('businessCertificate', data.businessCertificate[0]);
//       }
//       const response = await axios.post('/api/manufacturer-sign-up', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       toast({
//         title: "Registration Successful",
//         description: "Please check your email for verification",
//       });

//       router.replace(`/verify/${data.name}`)
//     } catch (error) {
//       toast({
//         title: "Registration Failed",
//         description: error.response?.data?.message || "Something went wrong",
//         variant: "destructive"
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-400/20 shadow-2xl p-8 sm:p-12">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
//             Manufacturer Registration
//           </h1>
//           <p className="text-gray-300">
//             Complete your manufacturing business profile
//           </p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit,(errors) => console.error("Validation Errors:", errors) )} className="space-y-6">
//           {/* Basic Information */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Building2 className="mr-2 text-blue-400" size={20} />
//                 Company Name
//               </label>
//               <input
//                 {...register('name')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="Company Name"
//               />
//               {errors.name && (
//                 <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Mail className="mr-2 text-blue-400" size={20} />
//                 Email Address
//               </label>
//               <input
//                 {...register('email')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="company@example.com"
//               />
//               {errors.email && (
//                 <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Contact and Security */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Phone className="mr-2 text-blue-400" size={20} />
//                 Phone Number
//               </label>
//               <input
//                 {...register('phoneNumber')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="10-digit phone number"
//               />
//               {errors.phoneNumber && (
//                 <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Lock className="mr-2 text-blue-400" size={20} />
//                 Password
//               </label>
//               <input
//                 type="password"
//                 {...register('password')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="Strong password"
//               />
//               {errors.password && (
//                 <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-white mb-2 flex items-center">
//               <Building2 className="mr-2 text-blue-400" size={20} />
//               Business Address
//             </label>
//             <textarea
//               {...register('address')}
//               className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//               placeholder="Complete business address"
//               rows={3}
//             />
//             {errors.address && (
//               <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
//             )}
//           </div>

//           {/* Registration Numbers */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <FileText className="mr-2 text-blue-400" size={20} />
//                 GST Number
//               </label>
//               <input
//                 {...register('gstNumber')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="15-digit GST number"
//               />
//               {errors.gstNumber && (
//                 <p className="text-red-400 text-sm mt-1">{errors.gstNumber.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Shield className="mr-2 text-blue-400" size={20} />
//                 Manufacturing License Number
//               </label>
//               <input
//                 {...register('manufacturingLicenseNumber')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="License number"
//               />
//               {errors.manufacturingLicenseNumber && (
//                 <p className="text-red-400 text-sm mt-1">{errors.manufacturingLicenseNumber.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <CreditCard className="mr-2 text-blue-400" size={20} />
//                 PAN Number
//               </label>
//               <input
//                 {...register('panNumber')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="10-character PAN"
//               />
//               {errors.panNumber && (
//                 <p className="text-red-400 text-sm mt-1">{errors.panNumber.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Briefcase className="mr-2 text-blue-400" size={20} />
//                 CIN Number
//               </label>
//               <input
//                 {...register('cinNumber')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="21-digit CIN"
//               />
//               {errors.cinNumber && (
//                 <p className="text-red-400 text-sm mt-1">{errors.cinNumber.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Products and Website */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Briefcase className="mr-2 text-blue-400" size={20} />
//                 Products Manufactured
//               </label>
//               <input
//                 {...register('productsManufactured')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="Comma-separated list of products"
//               />
//               {errors.productsManufactured && (
//                 <p className="text-red-400 text-sm mt-1">{errors.productsManufactured.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Globe className="mr-2 text-blue-400" size={20} />
//                 Website (Optional)
//               </label>
//               <input
//                 {...register('website')}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                 placeholder="https://your-company.com"
//               />
//               {errors.website && (
//                 <p className="text-red-400 text-sm mt-1">{errors.website.message}</p>
//               )}
//             </div>
//           </div>

//           {/* File Uploads */}
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Upload className="mr-2 text-blue-400" size={20} />
//                 Company Logo
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 {...register('companyLogo')}
//                 onChange={(e) => handleFilePreview(e, setPreviewLogo)}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//               />
//               {previewLogo && (
//                 <img src={previewLogo} alt="Logo Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
//               )}
//             </div>

//             <div>
//               <label className="block text-white mb-2 flex items-center">
//                 <Upload className="mr-2 text-blue-400" size={20} />
//                 Business Certificate
//               </label>
//               <input
//                 type="file"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 {...register('businessCertificate')}
//                 onChange={(e) => handleFilePreview(e, setPreviewCertificate)}
//                 className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//               />
//               {previewCertificate && (
//                 <img src={previewCertificate} alt="Certificate Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
//               )}
//             </div>
//           </div>

//           <div className="text-center mt-8">
//             <button 
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? 'Registering...' : 'Register Manufacturer'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManufacturerSignup;



'use client'
import { useForm } from "react-hook-form";
import { useState } from "react";
// import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import axios from 'axios';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Building2, Globe, Mail, Phone, Lock, FileText, CreditCard, Briefcase, Upload } from "lucide-react";
 import { ManufacturerSignUpSchema } from "@/Schema/manufacturerSchema";
 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const ManufacturerSignup = () => {
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewCertificate, setPreviewCertificate] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(ManufacturerSignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      address: '',
      gstNumber: '',
      manufacturingLicenseNumber: '',
      panNumber: '',
      cinNumber: '',
      productsManufactured: '',
      companyLogo: undefined,
      businessCertificate: undefined,
      website: ''
    }
  });

  const handleFileChange = async (e, fieldName) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;

    form.setValue(fieldName, file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          fieldName === 'companyLogo' 
            ? setPreviewLogo(reader.result)
            : setPreviewCertificate(reader.result);
        }
      }
      reader.readAsDataURL(file);
    }

    // const formData = new FormData();
    // formData.append('file', file);

    
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      const response = await axios.post('/api/manufacturer-sign-up', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast({
        title: 'Success',
        description: response.data.message
      });
      
      router.replace(`/verify/${data.name}`);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-400/20 shadow-2xl p-8 sm:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Manufacturer Registration
          </h1>
          <p className="text-gray-300">
            Complete your manufacturing business profile
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Building2 className="mr-2 text-blue-400" size={20} />
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Company Name" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Mail className="mr-2 text-blue-400" size={20} />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="company@example.com" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact and Security */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Phone className="mr-2 text-blue-400" size={20} />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="10-digit phone number" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Lock className="mr-2 text-blue-400" size={20} />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Strong password" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white flex items-center">
                    <Building2 className="mr-2 text-blue-400" size={20} />
                    Business Address
                  </FormLabel>
                  <FormControl>
                    <textarea 
                      {...field}
                      className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
                      placeholder="Complete business address"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Numbers */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <FileText className="mr-2 text-blue-400" size={20} />
                      GST Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="15-digit GST number" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturingLicenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Shield className="mr-2 text-blue-400" size={20} />
                      Manufacturing License Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="License number" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <CreditCard className="mr-2 text-blue-400" size={20} />
                      PAN Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="10-character PAN" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cinNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Briefcase className="mr-2 text-blue-400" size={20} />
                      CIN Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="21-digit CIN" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Products and Website */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="productsManufactured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Briefcase className="mr-2 text-blue-400" size={20} />
                      Products Manufactured
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Comma-separated list of products" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Globe className="mr-2 text-blue-400" size={20} />
                      Website (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://your-company.com" 
                        {...field}
                        className="bg-white/10 border border-blue-400/20 text-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Upload className="mr-2 text-blue-400" size={20} />
                      Company Logo
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'companyLogo')}
                          className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
                        />
                        
                        {previewLogo && (
                          <img 
                            src={previewLogo} 
                            alt="Logo Preview" 
                            className="mt-2 w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessCertificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white flex items-center">
                      <Upload className="mr-2 text-blue-400" size={20} />
                      Business Certificate
                    </FormLabel>
                    <FormControl>


                    
                    <div className="space-y-2">
                        <Input 
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'businessCertificate')}
                          className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
                        />
                       
                        {previewCertificate && (
                          <img 
                            src={previewCertificate} 
                            alt="Certificate Preview" 
                            className="mt-2 w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-center mt-8">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Manufacturer'
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-gray-300">
            Already registered?{' '}
            <Link href="/SignIn" className="text-blue-400 hover:text-blue-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerSignup;