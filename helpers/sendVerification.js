import { resend } from "@/lib/resend";

import VerificationEmail from "@/emails/VerificationEmails";


export async function sendVerificationEmail(
    name,
    email,
    verifyCode
){
  try {
   const response= await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'QRChain:Verification code of email',
        react: <VerificationEmail name={name} otp={verifyCode} />
        
      });
      console.log('Resend API Response:', response);
      console.log('The email is',email);
      
     return{success:true,message:'Verification email sent successfully'}

  } catch (error) {
    console.error('Detailed error sending verification email:', error);
    return {
        success: false,
        message: `Failed to send email`
    }
}
}