
// 'use client'
// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Upload, Shield, Building2, Globe, Mail, Phone, Lock, FileText, CreditCard, Briefcase } from 'lucide-react';
// import { useToast } from "../../hooks/useToast"
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



// 'use client'
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// // import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useToast } from "../../hooks/useToast";
// import { useRouter } from "next/navigation";
// import axios from 'axios';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Button } from "../../components/ui/button";
// // import { Button } from "@/components/ui/button";
// import { Loader2, Shield, Building2, Globe, Mail, Phone, Lock, FileText, CreditCard, Briefcase, Upload } from "lucide-react";
//  import {ManufacturerClientSchema} from "../../Schema/manufacturerClientShema"
 
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/ui/form"
// import { Input } from "../../components/ui/input"

// const ManufacturerSignup = () => {
//   const [previewLogo, setPreviewLogo] = useState(null);
//   const [previewCertificate, setPreviewCertificate] = useState(null);
//  const [previewgst,setPreviewgst]=useState(null);
//  const [previewManLicense,setPreviewManLicense]=useState(null);
//  const [previewpan,setPreviewPan]=useState(null);
//  const [previewcin,setPreviewCin]=useState(null);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { toast } = useToast();
//   const router = useRouter();
  
//   const form = useForm({
//     resolver: zodResolver(ManufacturerClientSchema),
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
  
      
//       website: '',
//       gstCertificate:undefined,
//       manufacturingLicenseCertificate:undefined,
//       panNumberCertificate:undefined,
//       cinCertificate:undefined,
//       companyLogo: undefined,
//       businessCertificate: undefined,
//     }
//   });

//   const handleFileChange = async (e, fieldName) => {
//     if (!e.target.files || e.target.files.length === 0) return;
    
//     const file = e.target.files[0];
//     if (!file) return;

//     form.setValue(fieldName, file);
    
//     if (file.type.startsWith('image/')) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (typeof reader.result === 'string') {
//           // fieldName === 'companyLogo' 
//           //   ? setPreviewLogo(reader.result)
//           //   : setPreviewCertificate(reader.result);
//             if(fieldName==='companyLogo'){
//               setPreviewLogo(reader.result);
//             }else if(fieldName==='gstCertificate')
//             {
//               setPreviewgst(reader.result);
//             }else if(fieldName==='manufacturingLicenseCertificate'){
//               setPreviewManLicense(reader.result);
//             }else if(fieldName==='panNumberCertificate'){
//               setPreviewPan(reader.result);
//             }else if(fieldName==='cinCertificate'){
//               setPreviewCin(reader.result);
//             }else{
//               setPreviewCertificate(reader.result)
//             }
           
//         }
//       }
//       reader.readAsDataURL(file);
//     }

//     // const formData = new FormData();
//     // formData.append('file', file);

    
//   }

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     try {
//       console.log("The data is",data);
      
//       const formData = new FormData();
      
//       Object.entries(data).forEach(([key, value]) => {
//         if (value instanceof File) {
//           formData.append(key, value);
//         } else if (value !== undefined) {
//           formData.append(key, String(value));
//         }
//       });
      
//       const response = await axios.post('/api/manufacturer-sign-up', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       toast({
//         title: 'Success',
//         description: response.data.message
//       });
      
//       router.replace(`/verify/${data.name}`);
//     } catch (error) {
//       toast({
//         title: "Registration Failed",
//         description: error.response?.data?.message || "Something went wrong",
//         variant: 'destructive'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

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

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("Validation Errors:", errors))} className="space-y-6">
            
//             {/* Basic Information */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Building2 className="mr-2 text-blue-400" size={20} />
//                       Company Name
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Company Name" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Mail className="mr-2 text-blue-400" size={20} />
//                       Email Address
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="company@example.com" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Contact and Security */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="phoneNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Phone className="mr-2 text-blue-400" size={20} />
//                       Phone Number
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="10-digit phone number" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Lock className="mr-2 text-blue-400" size={20} />
//                       Password
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         type="password"
//                         placeholder="Strong password" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Address */}
//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-white flex items-center">
//                     <Building2 className="mr-2 text-blue-400" size={20} />
//                     Business Address
//                   </FormLabel>
//                   <FormControl>
//                     <textarea 
//                       {...field}
//                       className="w-full bg-white/10 border border-blue-400/20 rounded-lg p-3 text-white"
//                       placeholder="Complete business address"
//                       rows={3}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Registration Numbers */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="gstNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <FileText className="mr-2 text-blue-400" size={20} />
//                       GST Number
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="15-digit GST number" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* gst certificate */}
//               <FormField
//                 control={form.control}
//                 name="gstCertificate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Upload className="mr-2 text-blue-400" size={20} />
//                       Gst Certificate
//                     </FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         <Input 
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleFileChange(e, 'gstCertificate')}
//                           className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//                         />
                        
//                         {previewgst && (
//                           <img 
//                             src={previewgst} 
//                             alt="Logo Preview" 
//                             className="mt-2 w-20 h-20 object-cover rounded-lg"
//                           />
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* manufacturing license number */}
//               <FormField
//                 control={form.control}
//                 name="manufacturingLicenseNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Shield className="mr-2 text-blue-400" size={20} />
//                       Manufacturing License Number
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="License number" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//                 {/* manufacturing license certificate */}
//                 <FormField
//                 control={form.control}
//                 name="manufacturingLicenseCertificate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Upload className="mr-2 text-blue-400" size={20} />
//                     Manufacturing License Certificate
//                     </FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         <Input 
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleFileChange(e, 'manufacturingLicenseCertificate')}
//                           className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//                         />
                        
//                         {previewManLicense && (
//                           <img 
//                             src={previewManLicense} 
//                             alt="Logo Preview" 
//                             className="mt-2 w-20 h-20 object-cover rounded-lg"
//                           />
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="panNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <CreditCard className="mr-2 text-blue-400" size={20} />
//                       PAN Number
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="10-character PAN" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//                {/* pan number certificate */}
//                <FormField
//                 control={form.control}
//                 name="panNumberCertificate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Upload className="mr-2 text-blue-400" size={20} />
//                       Pan Certificate
//                     </FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         <Input 
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleFileChange(e, 'panNumberCertificate')}
//                           className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//                         />
                        
//                         {previewpan && (
//                           <img 
//                             src={previewpan} 
//                             alt="Logo Preview" 
//                             className="mt-2 w-20 h-20 object-cover rounded-lg"
//                           />
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="cinNumber"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Briefcase className="mr-2 text-blue-400" size={20} />
//                       CIN Number
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="21-digit CIN" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//                <FormField
//                 control={form.control}
//                 name="cinCertificate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Upload className="mr-2 text-blue-400" size={20} />
//                       Cin Certificate
//                     </FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         <Input 
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleFileChange(e, 'cinCertificate')}
//                           className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//                         />
                        
//                         {previewcin && (
//                           <img 
//                             src={previewcin} 
//                             alt="Logo Preview" 
//                             className="mt-2 w-20 h-20 object-cover rounded-lg"
//                           />
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Products and Website */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="productsManufactured"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Briefcase className="mr-2 text-blue-400" size={20} />
//                       Products Manufactured
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="Comma-separated list of products" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="website"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Globe className="mr-2 text-blue-400" size={20} />
//                       Website (Optional)
//                     </FormLabel>
//                     <FormControl>
//                       <Input 
//                         placeholder="https://your-company.com" 
//                         {...field}
//                         className="bg-white/10 border border-blue-400/20 text-white" 
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* File Uploads */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <FormField
//                 control={form.control}
//                 name="companyLogo"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Upload className="mr-2 text-blue-400" size={20} />
//                       Company Logo
//                     </FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         <Input 
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleFileChange(e, 'companyLogo')}
//                           className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//                         />
                        
//                         {previewLogo && (
//                           <img 
//                             src={previewLogo} 
//                             alt="Logo Preview" 
//                             className="mt-2 w-20 h-20 object-cover rounded-lg"
//                           />
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="businessCertificate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white flex items-center">
//                       <Upload className="mr-2 text-blue-400" size={20} />
//                       Business Certificate
//                     </FormLabel>
//                     <FormControl>


                    
//                     <div className="space-y-2">
//                         <Input 
//                           type="file"
//                           accept=".pdf,.jpg,.jpeg,.png"
//                           onChange={(e) => handleFileChange(e, 'businessCertificate')}
//                           className="bg-white/10 border border-blue-400/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-400/20 file:text-white"
//                         />
                       
//                         {previewCertificate && (
//                           <img 
//                             src={previewCertificate} 
//                             alt="Certificate Preview" 
//                             className="mt-2 w-20 h-20 object-cover rounded-lg"
//                           />
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="text-center mt-8">
//               <Button 
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Registering...
//                   </>
//                 ) : (
//                   'Register Manufacturer'
//                 )}
//               </Button>
//             </div>
//           </form>
//         </Form>

//         <div className="text-center mt-4">
//           <p className="text-gray-300">
//             Already registered?{' '}
//             <Link href="/SignIn" className="text-blue-400 hover:text-blue-300">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManufacturerSignup;
// my code

'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../hooks/useToast";
import axios from 'axios';
import {ManufacturerClientSchema} from "../../Schema/manuFacturerClientShema";
import {
   Mail, Phone, Lock,  
   ArrowRight, ArrowLeft,
    Loader2,User,Info
} from "lucide-react";
import { ImageIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from 'framer-motion';
import { FileText, Shield, Building2, Upload, Check, Globe, Package, Camera ,CreditCard} from 'lucide-react';

const steps = [
  { id: 1, title: "Basic Information", description: "Company details and contact" },
  { id: 2, title: "Legal Documents", description: "Business certificates and licenses" },
  { id: 3, title: "Additional Info", description: "Products and branding" },
  { id: 4, title: "Review", description: "Verify your information" }
];
const getFieldsForStep = (step) => {
  switch (step) {
    case 1: // Basic Information
      return ['name', 'email', 'phoneNumber', 'password', 'address'];
    case 2: // Legal Documents
      return ['gstNumber', 'gstCertificate', 'manufacturingLicenseNumber', 
              'manufacturingLicenseCertificate', 'panNumber', 'panNumberCertificate'];
    case 3: // Additional Info
      return ['cinNumber', 'cinCertificate', 'productsManufactured', 
              'companyLogo', 'businessCertificate', 'website'];
    case 4: // Review
      return []; // No validation needed for review step
    default:
      return [];
  }
};
const StepIndicator = ({ currentStep, completedSteps }) => (
  <div className="w-full max-w-3xl mx-auto mb-8">
    <div className="flex justify-between">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex flex-col items-center w-1/4">
          <div className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
              ${currentStep >= step.id 
                ? 'border-blue-500 bg-blue-500 text-white' 
                : 'border-gray-300 text-gray-300'}`}>
              {completedSteps.includes(step.id) ? <Check size={24} /> : step.id}
            </div>
            {idx < steps.length - 1 && (
              <div className={`absolute top-1/2 w-full h-1 -z-10 transition-all duration-300
                ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
            )}
          </div>
          <div className="mt-2 text-center">
            <p className={`font-medium ${currentStep === step.id ? 'text-blue-400' : 'text-gray-400'}`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-400">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BasicInfoStep = ({ form }) => (
  <div className="space-y-6 animate-fadeIn">
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
                placeholder="Enter your company name" 
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
              Business Email
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
    {/* Rest of the basic info fields */}
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
  </div>
);


const DocumentsStep = ({ form, handleFileChange, previewgst, previewManLicense, previewpan }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 max-w-4xl mx-auto"
  >
    {/* GST Section */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <FileText className="text-blue-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">GST Information</h3>
          <p className="text-slate-400 text-sm mt-1">Please provide your GST details and certificate</p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">GST Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="15-digit GST number"
                    className="h-12 bg-slate-800/50 border-slate-600 focus:border-blue-500 text-white 
                    placeholder:text-slate-500 pl-4 pr-10 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-800/80"
                  />
                  {field.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gstCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">GST Certificate</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8
                      group-hover:border-blue-400 transition-all duration-300 bg-slate-800/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'gstCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-slate-300 font-medium mb-1">Drop your certificate here</p>
                        <p className="text-slate-400 text-sm">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {previewgst && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-slate-600">
                        <img
                          src={previewgst}
                          alt="GST Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white text-sm font-medium truncate">Preview Certificate</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Manufacturing License Section */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <Shield className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Manufacturing License</h3>
          <p className="text-slate-400 text-sm mt-1">Upload your manufacturing license details</p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="manufacturingLicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">License Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter license number"
                    className="h-12 bg-slate-800/50 border-slate-600 focus:border-emerald-500 text-white 
                    placeholder:text-slate-500 pl-4 pr-10 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-emerald-500/20 focus:bg-slate-800/80"
                  />
                  {field.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufacturingLicenseCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">License Certificate</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8
                      group-hover:border-emerald-400 transition-all duration-300 bg-slate-800/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'manufacturingLicenseCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-slate-300 font-medium mb-1">Drop your license here</p>
                        <p className="text-slate-400 text-sm">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {previewManLicense && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-slate-600">
                        <img
                          src={previewManLicense}
                          alt="License Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white text-sm font-medium truncate">Preview License</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}

        />
      </div>
    </div>
    {/* pan section */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <Shield className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Pan Details</h3>
          <p className="text-slate-400 text-sm mt-1">Upload your manufacturing license details</p>
        </div>
      </div>

      <div className="space-y-6">
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
          name="panNumberCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">Pan Certificate</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8
                      group-hover:border-emerald-400 transition-all duration-300 bg-slate-800/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'panNumberCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-emerald-400" />
                        </div>
                        <p className="text-slate-300 font-medium mb-1">Drop your license here</p>
                        <p className="text-slate-400 text-sm">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {previewpan && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-slate-600">
                        <img
                          src={previewpan}
                          alt="License Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white text-sm font-medium truncate">Preview License</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}

        />
      

      </div>
    </div>
  </motion.div>
);


const CompanyDetailsStep = ({ form, handleFileChange, previewcin, previewLogo, previewCertificate }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8 max-w-4xl mx-auto"
  >
    {/* Company Information */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-xl">
          <Building2 className="text-purple-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Company Information</h3>
          <p className="text-slate-400 text-sm mt-1">Enter your company's basic information</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <FormField
          control={form.control}
          name="cinNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">CIN Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="21-digit CIN"
                    className="h-12 bg-slate-800/50 border-slate-600 focus:border-purple-500 text-white 
                    placeholder:text-slate-500 pl-4 pr-10 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-purple-500/20 focus:bg-slate-800/80"
                  />
                  {field.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">Company Website</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Globe className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    {...field}
                    placeholder="https://example.com"
                    className="h-12 bg-slate-800/50 border-slate-600 focus:border-purple-500 text-white 
                    placeholder:text-slate-500 pl-10 pr-4 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-purple-500/20 focus:bg-slate-800/80"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productsManufactured"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-slate-200 font-medium flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-400" />
                Products Manufactured
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Enter comma-separated list of products"
                  className="w-full min-h-[100px] bg-slate-800/50 border-slate-600 focus:border-purple-500 
                  text-white placeholder:text-slate-500 p-4 rounded-xl transition-all duration-200
                  focus:ring-2 focus:ring-purple-500/20 focus:bg-slate-800/80 resize-none"
                />
              </FormControl>
              <FormDescription className="text-slate-400 text-sm mt-2">
                List all products your company manufactures, separated by commas
              </FormDescription>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Document Uploads */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-emerald-500/10 rounded-xl">
          <FileText className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Legal Documents</h3>
          <p className="text-slate-400 text-sm mt-1">Upload your company's required documentation</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <FormField
          control={form.control}
          name="cinCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">CIN Certificate</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-4">
                  <div className="relative group h-[112px]">
                    <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-xl
                      group-hover:border-emerald-400 transition-all duration-300 bg-slate-800/30">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'cinCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className="p-3 bg-emerald-500/10 rounded-full mb-2">
                          <Upload className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-slate-300 font-medium text-sm mb-1">Upload CIN Certificate</p>
                        <p className="text-slate-400 text-xs">PDF, JPG, PNG accepted</p>
                      </div>
                    </div>
                  </div>

                  {previewcin && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-slate-600 flex-shrink-0">
                        <img
                          src={previewcin}
                          alt="CIN Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium truncate">Certificate Uploaded</p>
                        <p className="text-emerald-400 text-xs">Click above to change</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">Business Certificate</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-4">
                  <div className="relative group h-[112px]">
                    <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-xl
                      group-hover:border-emerald-400 transition-all duration-300 bg-slate-800/30">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'businessCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className="p-3 bg-emerald-500/10 rounded-full mb-2">
                          <Upload className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-slate-300 font-medium text-sm mb-1">Upload Business Certificate</p>
                        <p className="text-slate-400 text-xs">PDF, JPG, PNG accepted</p>
                      </div>
                    </div>
                  </div>

                  {previewCertificate && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden ring-2 ring-slate-600 flex-shrink-0">
                        <img
                          src={previewCertificate}
                          alt="Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium truncate">Certificate Uploaded</p>
                        <p className="text-emerald-400 text-xs">Click above to change</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Company Assets */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Camera className="text-amber-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Company Branding</h3>
          <p className="text-slate-400 text-sm mt-1">Upload your company logo</p>
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-200 font-medium">Company Logo</FormLabel>
              <FormControl>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="relative group md:w-1/2">
                    <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-6 h-[112px]
                      group-hover:border-amber-400 transition-all duration-300 bg-slate-800/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'companyLogo')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className="p-3 bg-amber-500/10 rounded-full mb-2">
                          <Upload className="w-5 h-5 text-amber-400" />
                        </div>
                        <p className="text-slate-300 font-medium text-sm mb-1">Upload company logo</p>
                        <p className="text-slate-400 text-xs">PNG or SVG recommended</p>
                      </div>
                    </div>
                  </div>

                  {previewLogo ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="md:w-1/2 flex flex-col items-center justify-center"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden ring-2 ring-slate-600 bg-slate-700">
                        <img
                          src={previewLogo}
                          alt="Logo Preview"
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <p className="text-slate-300 text-sm font-medium mt-2">Logo Preview</p>
                    </motion.div>
                  ) : (
                    <div className="md:w-1/2 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400 text-sm mt-2">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="text-slate-400 text-sm mt-4">
                For best results, upload a square logo with transparent background
              </FormDescription>
              <FormMessage className="text-rose-400 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>
  </motion.div>
);
const ReviewStep = ({ formData, previewgst, previewManLicense, previewpan, previewcin, previewLogo, previewCertificate }) => {
  // Group the form data into sections that match your form steps
  const personalInfo = {
    name: formData.name,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    address: formData.address,
  };

  const legalInfo = {
    gstNumber: formData.gstNumber,
    manufacturingLicenseNumber: formData.manufacturingLicenseNumber,
    panNumber: formData.panNumber,
  };

  const companyInfo = {
    cinNumber: formData.cinNumber,
    website: formData.website,
    productsManufactured: formData.productsManufactured,
  };

  // Function to render a simple text field
  const renderField = (label, value) => (
    <div className="py-3 border-b border-slate-700">
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-white font-medium text-right">{value || "Not provided"}</span>
      </div>
    </div>
  );

  // Function to render document preview
  const renderDocument = (label, preview) => (
    <div className="py-3 border-b border-slate-700">
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className="flex items-center">
          {preview ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-2 ring-slate-600 flex-shrink-0">
              <img
                src={preview}
                alt={`${label} Preview`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          ) : (
            <span className="text-rose-400 font-medium text-sm">Not uploaded</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Personal Information */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <User className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Personal Information</h3>
            <p className="text-slate-400 text-sm mt-1">Review your contact details</p>
          </div>
        </div>

        <div className="space-y-1">
          {renderField("Full Name", personalInfo.name)}
          {renderField("Email Address", personalInfo.email)}
          {renderField("Phone Number", personalInfo.phoneNumber)}
          {renderField("Address", personalInfo.address)}
        </div>
      </div>

      {/* Legal Documents */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <FileText className="text-purple-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Legal Information</h3>
            <p className="text-slate-400 text-sm mt-1">Review your business credentials</p>
          </div>
        </div>

        <div className="space-y-1">
          {renderField("GST Number", legalInfo.gstNumber)}
          {renderDocument("GST Certificate", previewgst)}
          
          {renderField("Manufacturing License", legalInfo.manufacturingLicenseNumber)}
          {renderDocument("Manufacturing License Certificate", previewManLicense)}
          
          {renderField("PAN Number", legalInfo.panNumber)}
          {renderDocument("PAN Certificate", previewpan)}
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Building2 className="text-emerald-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Company Details</h3>
            <p className="text-slate-400 text-sm mt-1">Review your company information</p>
          </div>
        </div>

        <div className="space-y-1">
          {renderField("CIN Number", companyInfo.cinNumber)}
          {renderDocument("CIN Certificate", previewcin)}
          
          {renderField("Website", companyInfo.website)}
          
          <div className="py-3 border-b border-slate-700">
            <div className="flex justify-between items-start">
              <span className="text-slate-400 text-sm">Products Manufactured</span>
              <div className="text-white font-medium text-right max-w-md">
                <p className="whitespace-pre-wrap break-words">{companyInfo.productsManufactured || "Not provided"}</p>
              </div>
            </div>
          </div>
          
          {renderDocument("Business Certificate", previewCertificate)}
        </div>
      </div>

      {/* Company Assets */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <ImageIcon className="text-amber-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Company Branding</h3>
            <p className="text-slate-400 text-sm mt-1">Review your company logo</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          {previewLogo ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-800 p-2 ring-2 ring-slate-600">
                <img 
                  src={previewLogo} 
                  alt="Company Logo Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-slate-300 text-sm font-medium mt-2">Company Logo</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm mt-2">No logo uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-2xl p-6 shadow-xl border border-blue-400/20">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="text-blue-400 w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Final Confirmation</h3>
        </div>
        <p className="text-slate-300 text-sm">
          By completing your registration, you confirm that all information provided is accurate and complete. 
          After submission, our team will review your application and may contact you for additional verification.
        </p>
      </div>
    </motion.div>
  );
};



const ManufacturerSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
 // const [previews, setPreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewCertificate, setPreviewCertificate] = useState(null);
 const [previewgst,setPreviewgst]=useState(null);
 const [previewManLicense,setPreviewManLicense]=useState(null);
 const [previewpan,setPreviewPan]=useState(null);
 const [previewcin,setPreviewCin]=useState(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(ManufacturerClientSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      address: '',
      gstNumber: '',
      gstCertificate: undefined,
      manufacturingLicenseNumber: '',
      manufacturingLicenseCertificate: undefined,
      panNumber: '',
      panNumberCertificate: undefined,
      cinNumber: '',
      cinCertificate: undefined,
      productsManufactured: '',
      companyLogo: undefined,
      businessCertificate: undefined,
      website: ''
    }
  });

  const handleFileChange = (e, fieldName) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    if (!file) return;

    form.setValue(fieldName, file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          switch (fieldName) {
            case 'gstCertificate':
              setPreviewgst(reader.result);
              break;
            case 'manufacturingLicenseCertificate':
              setPreviewManLicense(reader.result);
              break;
            case 'panNumberCertificate':
              setPreviewPan(reader.result);
              break;
            case 'cinCertificate':
              setPreviewCin(reader.result);
              break;
            case 'companyLogo':
              setPreviewLogo(reader.result);
              break;
            case 'businessCertificate':
              setPreviewCertificate(reader.result);
              break;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // const validateStep = async () => {
  //   const fields = getFieldsForStep(currentStep);
  //   const result = await form.trigger(fields);
  //   if (result) {
  //     setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
  //     return true;
  //   }
  //   return false;
  // };

  const validateStep = async () => {
    // For the review step (step 4), no validation is needed
    if (currentStep === 4) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      return true;
    }
  
    // Get fields for the current step
    const fields = getFieldsForStep(currentStep);
    console.log("Fields to validate:", fields);
    
    try {
      // Get the current errors
      const currentErrors = form.formState.errors;
      
      // Manually validate each field without using form.trigger
      let hasErrors = false;
      
      // Trigger all fields at once - this is different from field-by-field validation
      await form.trigger();
      
      // Now check if any field in our step has errors
      for (const field of fields) {
        if (form.formState.errors[field]) {
          console.log(`Field ${field} has error:`, form.formState.errors[field]);
          hasErrors = true;
        }
      }
      
      if (!hasErrors) {
        setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };
  const nextStep = async () => {
    if (await validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

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
        title: 'Registration Successful',
        description: 'Your account has been created. Please verify your email.',
        duration: 5000,
      });
      
      router.replace(`/verify/${data.name}`);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "An error occurred during registration",
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl border border-blue-400/20 shadow-2xl p-8 sm:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Manufacturer Registration
          </h1>
          <p className="text-gray-300 text-lg">
            Join our network of verified manufacturers
          </p>
        </div>

        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && <BasicInfoStep form={form} />}
            {currentStep === 2 && (
              <DocumentsStep 
                form={form} 
                handleFileChange={handleFileChange}
                previewgst={previewgst}
                previewManLicense={previewManLicense}
                previewpan={previewpan}
              />
            )}
            {currentStep === 3 && (
              <CompanyDetailsStep 
                form={form}
                handleFileChange={handleFileChange}
                previewcin={previewcin}
                previewLogo={previewLogo}
                previewCertificate={previewCertificate}
              />
            )}
            {currentStep === 4 && (
              <ReviewStep 
                formData={form.getValues()}
                previewgst={previewgst}
                previewManLicense={previewManLicense}
                previewpan={previewpan}
                previewcin={previewcin}
                previewLogo={previewLogo}
                previewCertificate={previewCertificate}
              />
            )}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 text-white border-blue-400/20 font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-300"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Previous
                </Button>
              )}
              
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center ml-auto transition-all duration-300"
                >
                  Next Step
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center ml-auto transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="text-center mt-6">
          <p className="text-gray-300">
            Already registered?{' '}
            <Link 
              href="/SignIn" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerSignup;