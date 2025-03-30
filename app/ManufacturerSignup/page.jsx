'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../../hooks/useToast";
import Select from 'react-select'
import axios from 'axios';
import {ManufacturerClientSchema} from "../../Schema/manufacturerClientShema";
import {
   Mail, Phone, Lock,  
   ArrowRight, ArrowLeft,
    Loader2,User,Info,CheckCircle
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
// const StepIndicator = ({ currentStep, completedSteps }) => (
//   <div className="w-full max-w-3xl mx-auto mb-8">
//     <div className="flex justify-between">
//       {steps.map((step, idx) => (
//         <div key={step.id} className="flex flex-col items-center w-1/4">
//           <div className="relative">
//             <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
//               ${currentStep >= step.id 
//                 ? 'border-blue-500 bg-blue-500 text-white' //current steep
//                 : 'border-gray-300 text-gray-300'}`}>      
  
//               {completedSteps.includes(step.id) ? <Check size={24} /> : step.id}
//             </div>

//             {idx < steps.length - 1 && ( //to make sure there is no line after the last step
//               <div className={`absolute top-1/2 w-full h-1 -z-10 transition-all duration-300
//                 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
//             )}
//           </div>
//           <div className="mt-2 text-center">
//             <p className={`font-medium ${currentStep === step.id ? 'text-blue-400' : 'text-gray-400'}`}>
//               {step.title}
//             </p>
//             <p className="text-xs text-gray-400">{step.description}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );
const StepIndicator = ({ currentStep, completedSteps }) => (
  <div className="w-full max-w-3xl mx-auto mb-8">
    <div className="flex justify-between">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex flex-col items-center w-1/4">
          <div className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
              ${currentStep >= step.id 
                ? 'border-blue-500 bg-blue-500 text-white'  // Active step
                : 'border-gray-400 text-gray-600'}`} // Inactive step
            
            >
              {completedSteps.includes(step.id) ? <Check size={24} /> : step.id}
            </div>

            {idx < steps.length - 1 && ( // Ensure no line after the last step
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1 -z-10 transition-all duration-300
                ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-400'}`} // Adjusted line color
              />
            )}
          </div>
          <div className="mt-2 text-center">
            <p className={`font-medium ${currentStep === step.id ? 'text-blue-500' : 'text-gray-700'}`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BasicInfoStep = ({ form }) => (
  <div className="space-y-6 animate-fadeIn">
    {/* Header with gradient background */}
    <div className="p-4 mb-6 bg-gradient-to-r from-blue-500 to-blue-300 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-white">Basic Information</h3>
      <p className="text-blue-100">Please provide your company details</p>
    </div>

    {/* Company Name and Email */}
    <div className="grid md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 flex items-center">
              <Building2 className="mr-2 text-blue-500" size={20} />
              Company Name
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your company name" 
                {...field}
                className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 
                           transition-all duration-300 placeholder-gray-500" 
              />
            </FormControl>
            <FormMessage className="text-blue-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 flex items-center">
              <Mail className="mr-2 text-blue-500" size={20} />
              Business Email
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="company@example.com" 
                {...field}
                className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 
                           transition-all duration-300 placeholder-gray-500" 
              />
            </FormControl>
            <FormMessage className="text-blue-500" />
          </FormItem>
        )}
      />
    </div>

    {/* Phone and Password */}
    <div className="grid md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 flex items-center">
              <Phone className="mr-2 text-blue-500" size={20} />
              Phone Number
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="10-digit phone number" 
                {...field}
                className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 
                           transition-all duration-300 placeholder-gray-500" 
              />
            </FormControl>
            <FormMessage className="text-blue-500" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 flex items-center">
              <Lock className="mr-2 text-blue-500" size={20} />
              Password
            </FormLabel>
            <FormControl>
              <Input 
                type="password"
                placeholder="Strong password" 
                {...field}
                className="bg-gray-100 border border-gray-300 text-gray-900 focus:border-blue-500 
                           transition-all duration-300 placeholder-gray-500" 
              />
            </FormControl>
            <FormMessage className="text-blue-500" />
          </FormItem>
        )}
      />
    </div>

    {/* Address */}
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 flex items-center">
              <Building2 className="mr-2 text-blue-500" size={20} />
              Business Address
            </FormLabel>
            <FormControl>
              <textarea 
                {...field}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-900
                           focus:border-blue-500 focus:outline-none transition-all duration-300
                           placeholder-gray-500"
                placeholder="Complete business address"
                rows={3}
              />
            </FormControl>
            <FormMessage className="text-blue-500" />
          </FormItem>
        )}
      />
    </div>

    {/* Form tips */}
    <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <h4 className="text-gray-800 font-medium flex items-center mb-2">
        <CheckCircle className="mr-2 text-blue-500" size={18} />
        Registration Tips
      </h4>
      <ul className="text-gray-700 text-sm space-y-1">
        <li className="flex items-start">
          <ArrowRight className="min-w-5 h-5 mt-0.5 mr-2 text-blue-500" />
          <span>Use your official business email for verification</span>
        </li>
        <li className="flex items-start">
          <ArrowRight className="min-w-5 h-5 mt-0.5 mr-2 text-blue-500" />
          <span>Ensure your business address matches registration documents</span>
        </li>
      </ul>
    </div>
  </div>
);

const DocumentsStep = ({ form, handleFileChange, previewgst, previewManLicense, previewpan }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 max-w-4xl mx-auto"
  >
    {/* GST Section */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <FileText className="text-blue-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">GST Information</h3>
          <p className="text-gray-500 text-sm mt-1">Please provide your GST details and certificate</p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">GST Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="15-digit GST number"
                    className="h-12 bg-gray-100 border-gray-300 focus:border-blue-400 text-gray-800 
                    placeholder:text-gray-500 pl-4 pr-10 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-blue-400/30 focus:bg-white"
                  />
                  {field.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gstCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">GST Certificate</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8
                      group-hover:border-blue-400 transition-all duration-300 bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'gstCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Drop your certificate here</p>
                        <p className="text-gray-500 text-sm">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {previewgst && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-gray-300">
                        <img
                          src={previewgst}
                          alt="GST Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
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
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Manufacturing License Section */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-green-100 rounded-xl">
          <Shield className="text-green-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Manufacturing License</h3>
          <p className="text-gray-500 text-sm mt-1">Upload your manufacturing license details</p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="manufacturingLicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">License Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="Enter license number"
                    className="h-12 bg-gray-100 border-gray-300 focus:border-green-400 text-gray-800 
                    placeholder:text-gray-500 pl-4 pr-10 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-green-400/30 focus:bg-white"
                  />
                  {field.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="manufacturingLicenseCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">License Certificate</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8
                      group-hover:border-blue-400 transition-all duration-300 bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'manufacturingLicenseCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Drop your certificate here</p>
                        <p className="text-gray-500 text-sm">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {previewManLicense && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-gray-300">
                        <img
                          src={previewManLicense}
                          alt="GST Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
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
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>
   
    {/* PAN Section */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-yellow-100 rounded-xl">
          <CreditCard className="text-yellow-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">PAN Details</h3>
          <p className="text-gray-500 text-sm mt-1">Provide your PAN details</p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="panNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">PAN Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="10-character PAN" 
                  {...field}
                  className="bg-gray-100 border border-gray-300 text-gray-800" 
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="panNumberCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Pan Certificate</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8
                      group-hover:border-blue-400 transition-all duration-300 bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'panNumberCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Drop your certificate here</p>
                        <p className="text-gray-500 text-sm">or click to browse</p>
                      </div>
                    </div>
                  </div>

                  {previewpan && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-gray-300">
                        <img
                          src={previewpan}
                          alt="GST Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
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
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>
  </motion.div>
);

const CompanyDetailsStep = ({ form, handleFileChange, previewcin, previewLogo, previewCertificate, productOptions }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 max-w-4xl mx-auto"
  >
    {/* Company Information */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Building2 className="text-purple-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Company Information</h3>
          <p className="text-gray-500 text-sm mt-1">Enter your company's basic information</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <FormField
          control={form.control}
          name="cinNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">CIN Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="21-digit CIN"
                    className="h-12 bg-gray-100 border-gray-300 focus:border-purple-400 text-gray-800 
                    placeholder:text-gray-500 pl-4 pr-10 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-purple-400/30 focus:bg-white"
                  />
                  {field.value && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Company Website</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    {...field}
                    placeholder="https://example.com"
                    className="h-12 bg-gray-100 border-gray-300 focus:border-purple-400 text-gray-800 
                    placeholder:text-gray-500 pl-10 pr-4 rounded-xl transition-all duration-200
                    focus:ring-2 focus:ring-purple-400/30 focus:bg-white"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productsManufactured"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-gray-700 font-medium flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-500" />
                Industry Verticals
              </FormLabel>
              <FormControl>
                <Select
                  value={productOptions.filter(option => field.value?.includes(option.value))}
                  isMulti
                  options={productOptions}
                  placeholder="Search & select..."
                  className="text-gray-800"
                  classNamePrefix="react-select"
                  onChange={(selected) => {
                    // Extract just the value property from each selected option
                    const values = selected ? selected.map(item => item.value) : [];
                    form.setValue("productsManufactured", values);
                  }}
                />
              </FormControl>
              <FormDescription className="text-gray-500 text-sm mt-2">
                Select products your company manufactures. You can search for them.
              </FormDescription>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Document Uploads */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-emerald-100 rounded-xl">
          <FileText className="text-emerald-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Legal Documents</h3>
          <p className="text-gray-500 text-sm mt-1">Upload your company's required documentation</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
        <FormField
          control={form.control}
          name="cinCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">CIN Certificate</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8
                      group-hover:border-emerald-400 transition-all duration-300 bg-gray-100">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'cinCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-emerald-100 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Upload CIN Certificate</p>
                        <p className="text-gray-500 text-sm">PDF, JPG, PNG accepted</p>
                      </div>
                    </div>
                  </div>

                  {previewcin && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-gray-300">
                        <img
                          src={previewcin}
                          alt="CIN Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
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
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Business Certificate</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-4">
                  <div className="relative group">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8
                      group-hover:border-emerald-400 transition-all duration-300 bg-gray-100">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'businessCertificate')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-emerald-100 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Upload Business Certificate</p>
                        <p className="text-gray-500 text-sm">PDF, JPG, PNG accepted</p>
                      </div>
                    </div>
                  </div>

                  {previewCertificate && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-gray-300">
                        <img
                          src={previewCertificate}
                          alt="Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
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
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Company Assets */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-300">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-amber-100 rounded-xl">
          <Camera className="text-amber-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Company Branding</h3>
          <p className="text-gray-500 text-sm mt-1">Upload your company logo</p>
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="companyLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Company Logo</FormLabel>
              <FormControl>
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="relative group md:w-1/2">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8
                      group-hover:border-amber-400 transition-all duration-300 bg-gray-100">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'companyLogo')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-amber-100 rounded-full mb-4">
                          <Upload className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">Upload company logo</p>
                        <p className="text-gray-500 text-sm">PNG or SVG recommended</p>
                      </div>
                    </div>
                  </div>

                  {previewLogo ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="md:w-1/2 flex flex-col items-center justify-center"
                    >
                      <div className="relative w-40 h-40 rounded-xl overflow-hidden ring-2 ring-gray-300 bg-gray-100">
                        <img
                          src={previewLogo}
                          alt="Logo Preview"
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <p className="text-gray-700 text-sm font-medium mt-2">Logo Preview</p>
                    </motion.div>
                  ) : (
                    <div className="md:w-1/2 flex flex-col items-center justify-center">
                      <div className="w-40 h-40 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm mt-2">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="text-gray-500 text-sm mt-4">
                For best results, upload a square logo with transparent background
              </FormDescription>
              <FormMessage className="text-red-500 text-sm mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>
  </motion.div>
);
// const ReviewStep = ({ formData, previewgst, previewManLicense, previewpan, previewcin, previewLogo, previewCertificate }) => {
//   // Group the form data into sections that match your form steps
//   const personalInfo = {
//     name: formData.name,
//     email: formData.email,
//     phoneNumber: formData.phoneNumber,
//     address: formData.address,
//   };

//   const legalInfo = {
//     gstNumber: formData.gstNumber,
//     manufacturingLicenseNumber: formData.manufacturingLicenseNumber,
//     panNumber: formData.panNumber,
//   };

//   const companyInfo = {
//     cinNumber: formData.cinNumber,
//     website: formData.website,
//     productsManufactured: formData.productsManufactured,
//   };

//   // Function to render a simple text field
//   const renderField = (label, value) => (
//     <div className="py-3 border-b border-slate-700">
//       <div className="flex justify-between items-start">
//         <span className="text-slate-400 text-sm">{label}</span>
//         <span className="text-white font-medium text-right">{value || "Not provided"}</span>
//       </div>
//     </div>
//   );

//   // Function to render document preview
//   const renderDocument = (label, preview) => (
//     <div className="py-3 border-b border-slate-700">
//       <div className="flex justify-between items-start">
//         <span className="text-slate-400 text-sm">{label}</span>
//         <div className="flex items-center">
//           {preview ? (
//             <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-2 ring-slate-600 flex-shrink-0">
//               <img
//                 src={preview}
//                 alt={`${label} Preview`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
//                 <Check className="w-5 h-5 text-emerald-400" />
//               </div>
//             </div>
//           ) : (
//             <span className="text-rose-400 font-medium text-sm">Not uploaded</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-8 max-w-4xl mx-auto"
//     >
//       {/* Personal Information */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="p-3 bg-blue-500/10 rounded-xl">
//             <User className="text-blue-400 w-6 h-6" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-white">Personal Information</h3>
//             <p className="text-slate-400 text-sm mt-1">Review your contact details</p>
//           </div>
//         </div>

//         <div className="space-y-1">
//           {renderField("Full Name", personalInfo.name)}
//           {renderField("Email Address", personalInfo.email)}
//           {renderField("Phone Number", personalInfo.phoneNumber)}
//           {renderField("Address", personalInfo.address)}
//         </div>
//       </div>

//       {/* Legal Documents */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="p-3 bg-purple-500/10 rounded-xl">
//             <FileText className="text-purple-400 w-6 h-6" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-white">Legal Information</h3>
//             <p className="text-slate-400 text-sm mt-1">Review your business credentials</p>
//           </div>
//         </div>

//         <div className="space-y-1">
//           {renderField("GST Number", legalInfo.gstNumber)}
//           {renderDocument("GST Certificate", previewgst)}
          
//           {renderField("Manufacturing License", legalInfo.manufacturingLicenseNumber)}
//           {renderDocument("Manufacturing License Certificate", previewManLicense)}
          
//           {renderField("PAN Number", legalInfo.panNumber)}
//           {renderDocument("PAN Certificate", previewpan)}
//         </div>
//       </div>

//       {/* Company Details */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="p-3 bg-emerald-500/10 rounded-xl">
//             <Building2 className="text-emerald-400 w-6 h-6" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-white">Company Details</h3>
//             <p className="text-slate-400 text-sm mt-1">Review your company information</p>
//           </div>
//         </div>

//         <div className="space-y-1">
//           {renderField("CIN Number", companyInfo.cinNumber)}
//           {renderDocument("CIN Certificate", previewcin)}
          
//           {renderField("Website", companyInfo.website)}
          
//           <div className="py-3 border-b border-slate-700">
//             <div className="flex justify-between items-start">
//               <span className="text-slate-400 text-sm">Products Manufactured</span>
//               <div className="text-white font-medium text-right max-w-md">
//                 <p className="whitespace-pre-wrap break-words">{companyInfo.productsManufactured || "Not provided"}</p>
//               </div>
//             </div>
//           </div>
          
//           {renderDocument("Business Certificate", previewCertificate)}
//         </div>
//       </div>

//       {/* Company Assets */}
//       <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
//         <div className="flex items-center space-x-4 mb-6">
//           <div className="p-3 bg-amber-500/10 rounded-xl">
//             <ImageIcon className="text-amber-400 w-6 h-6" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-white">Company Branding</h3>
//             <p className="text-slate-400 text-sm mt-1">Review your company logo</p>
//           </div>
//         </div>

//         <div className="flex items-center justify-center py-6">
//           {previewLogo ? (
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-800 p-2 ring-2 ring-slate-600">
//                 <img 
//                   src={previewLogo} 
//                   alt="Company Logo Preview" 
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//               <p className="text-slate-300 text-sm font-medium mt-2">Company Logo</p>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
//                 <ImageIcon className="w-12 h-12 text-slate-500" />
//               </div>
//               <p className="text-slate-400 text-sm mt-2">No logo uploaded</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Terms and Conditions */}
//       <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-2xl p-6 shadow-xl border border-blue-400/20">
//         <div className="flex items-center space-x-3 mb-4">
//           <Info className="text-blue-400 w-5 h-5" />
//           <h3 className="text-lg font-semibold text-white">Final Confirmation</h3>
//         </div>
//         <p className="text-slate-300 text-sm">
//           By completing your registration, you confirm that all information provided is accurate and complete. 
//           After submission, our team will review your application and may contact you for additional verification.
//         </p>
//       </div>
//     </motion.div>
//   );
// };

const ReviewStep = ({ 
  formData, 
  previewgst, 
  previewManLicense, 
  previewpan, 
  previewcin, 
  previewLogo, 
  previewCertificate 
}) => {
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
    <div className="py-3 border-b border-gray-200">
      <div className="flex justify-between items-start">
        <span className="text-gray-600 text-sm">{label}</span>
        <span className="text-gray-900 font-medium text-right">{value || "Not provided"}</span>
      </div>
    </div>
  );

  // Function to render document preview
  const renderDocument = (label, preview) => (
    <div className="py-3 border-b border-gray-200">
      <div className="flex justify-between items-start">
        <span className="text-gray-600 text-sm">{label}</span>
        <div className="flex items-center">
          {preview ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-2 ring-gray-200 flex-shrink-0">
              <img
                src={preview}
                alt={`${label} Preview`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          ) : (
            <span className="text-rose-500 font-medium text-sm">Not uploaded</span>
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
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <User className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
            <p className="text-gray-500 text-sm mt-1">Review your contact details</p>
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
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <FileText className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Legal Information</h3>
            <p className="text-gray-500 text-sm mt-1">Review your business credentials</p>
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
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Building2 className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Company Details</h3>
            <p className="text-gray-500 text-sm mt-1">Review your company information</p>
          </div>
        </div>

        <div className="space-y-1">
          {renderField("CIN Number", companyInfo.cinNumber)}
          {renderDocument("CIN Certificate", previewcin)}
          
          {renderField("Website", companyInfo.website)}
          
          <div className="py-3 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 text-sm">Products Manufactured</span>
              <div className="text-gray-900 font-medium text-right max-w-md">
                <p className="whitespace-pre-wrap break-words">{companyInfo.productsManufactured || "Not provided"}</p>
              </div>
            </div>
          </div>
          
          {renderDocument("Business Certificate", previewCertificate)}
        </div>
      </div>

      {/* Company Assets */}
      <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-amber-100 rounded-xl">
            <ImageIcon className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Company Branding</h3>
            <p className="text-gray-500 text-sm mt-1">Review your company logo</p>
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          {previewLogo ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 p-2 ring-2 ring-gray-200">
                <img 
                  src={previewLogo} 
                  alt="Company Logo Preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-gray-700 text-sm font-medium mt-2">Company Logo</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mt-2">No logo uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 rounded-2xl p-6 shadow-md border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Info className="text-blue-600 w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-900">Final Confirmation</h3>
        </div>
        <p className="text-gray-700 text-sm">
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
  const productOptions = [
    { value: "Automotive & Transportation", label: "Automotive & Transportation" },
    { value: "Automotive Parts & Components", label: "Automotive Parts & Components" },
    { value: "Electric Vehicles (EV) Manufacturing", label: "Electric Vehicles (EV) Manufacturing" },
    { value: "Aerospace & Aviation", label: "Aerospace & Aviation" },
    { value: "Shipbuilding & Marine Equipment", label: "Shipbuilding & Marine Equipment" },
    { value: "Railway & Locomotive Manufacturing", label: "Railway & Locomotive Manufacturing" },
  
    { value: "Electronics & Electrical Equipment", label: "Electronics & Electrical Equipment" },
    { value: "Consumer Electronics", label: "Consumer Electronics (Smartphones, Laptops, TVs)" },
    { value: "Semiconductors & Microchips", label: "Semiconductors & Microchips" },
    { value: "Industrial Electronics & Automation", label: "Industrial Electronics & Automation" },
    { value: "Battery & Energy Storage Manufacturing", label: "Battery & Energy Storage Manufacturing" },
    { value: "Home Appliances", label: "Home Appliances" },
  
    { value: "Machinery & Heavy Equipment", label: "Machinery & Heavy Equipment" },
    { value: "Industrial Machinery & Tools", label: "Industrial Machinery & Tools" },
    { value: "Construction Equipment", label: "Construction Equipment (Cranes, Excavators)" },
    { value: "Agricultural Machinery", label: "Agricultural Machinery (Tractors, Harvesters)" },
    { value: "Mining Equipment", label: "Mining Equipment" },
  
    { value: "Metals & Materials", label: "Metals & Materials" },
    { value: "Steel & Iron Manufacturing", label: "Steel & Iron Manufacturing" },
    { value: "Aluminum & Non-Ferrous Metals", label: "Aluminum & Non-Ferrous Metals" },
    { value: "Glass & Ceramics", label: "Glass & Ceramics" },
    { value: "Cement & Concrete Production", label: "Cement & Concrete Production" },
  
    { value: "Chemicals & Petrochemicals", label: "Chemicals & Petrochemicals" },
    { value: "Plastics & Polymers Manufacturing", label: "Plastics & Polymers Manufacturing" },
    { value: "Paints, Coatings & Adhesives", label: "Paints, Coatings & Adhesives" },
    { value: "Fertilizers & Agrochemicals", label: "Fertilizers & Agrochemicals" },
    { value: "Industrial Gases", label: "Industrial Gases" },
  
    { value: "Textiles & Apparel", label: "Textiles & Apparel" },
    { value: "Fabric & Yarn Manufacturing", label: "Fabric & Yarn Manufacturing" },
    { value: "Apparel & Footwear Production", label: "Apparel & Footwear Production" },
    { value: "Technical Textiles", label: "Technical Textiles (Fire-resistant, Medical, Automotive)" },
  
    { value: "Pharmaceuticals & Medical Devices", label: "Pharmaceuticals & Medical Devices" },
    { value: "Pharmaceutical Manufacturing", label: "Pharmaceutical Manufacturing" },
    { value: "Medical Devices & Equipment", label: "Medical Devices & Equipment" },
    { value: "Biotechnology & Life Sciences", label: "Biotechnology & Life Sciences" },
  
    { value: "Food & Beverage Manufacturing", label: "Food & Beverage Manufacturing" },
    { value: "Packaged Food Processing", label: "Packaged Food Processing" },
    { value: "Beverage & Brewery Industry", label: "Beverage & Brewery Industry" },
    { value: "Dairy & Confectionery", label: "Dairy & Confectionery" },
  
    { value: "Packaging & Paper Products", label: "Packaging & Paper Products" },
    { value: "Corrugated Boxes & Cartons", label: "Corrugated Boxes & Cartons" },
    { value: "Flexible & Rigid Packaging", label: "Flexible & Rigid Packaging" },
    { value: "Printing & Labeling", label: "Printing & Labeling" },
  
    { value: "Renewable Energy & Sustainability", label: "Renewable Energy & Sustainability" },
    { value: "Solar Panel & Wind Turbine Manufacturing", label: "Solar Panel & Wind Turbine Manufacturing" },
    { value: "Electric Batteries & Green Technologies", label: "Electric Batteries & Green Technologies" },
    { value: "Recycling & Waste Management", label: "Recycling & Waste Management" },
  ];
  
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
      productsManufactured: [],
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
    
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
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

  const validateStep = async () => {
    const fields = getFieldsForStep(currentStep);  //array of all fields in current step
    const result = await form.trigger(fields);      
    console.log(result);
    
    if (result) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]); //current step is added to array of prev....new makes sure no duplicacy and ...new Set to convert object back into array
      return true;
    }
    return false;
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
      
      // router.replace(`/verify/${data.name}`);
      router.replace(`/verify/${data.email}`);
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
<div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
  <div className="w-full max-w-5xl bg-white rounded-2xl border border-blue-200 shadow-xl p-8 sm:p-12">
    <div className="text-center mb-10">
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">
            Manufacturer Registration
          </h1>
          <p className="text-gray-500 text-lg">
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
                productOptions={productOptions}
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
                  className="bg-white/5 bg-blue-600 hover:bg-blue-700 hover:bg-white/10 text-white border-blue-400/20 font-medium py-3 px-6 rounded-lg flex items-center transition-all duration-300"
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
                 // type="submit"
                 type="button"
                  disabled={isSubmitting}
                  onClick={() => form.handleSubmit(onSubmit)()}
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
          <p className="text-gray-500">
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