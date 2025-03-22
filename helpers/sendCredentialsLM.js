import { resend } from "../lib/resend";

import CredentialsEmail from "../emails/CredentialsEmail";


export async function sendCredentialsLM(
    name,
    email,
    //tempPassword
){
  try {
   const response= await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'QRChain:Credentials of your acount',
        react: <CredentialsEmail name={name}  />
        
      });
      console.log('Resend API Response:', response);
      console.log('The email is',email);
      
     return{success:true,message:'Credentials email sent successfully'}

  } catch (error) {
    console.error('Detailed error sending credentials email:', error);
    return {
        success: false,
        message: `Failed to send email`
    }
}
}