import { Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'

import { Toaster } from "../components/ui/toaster";
import AuthProvider from "../context/AuthProvider";
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "QR Chain",
  description: "Where Authenticity Meets Innovation.",
  other: {
    "facebook-domain-verification": "29su7jiemmkj50vw310vyhpdydhhto",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body
        className={monaSans.className}
      >
        <Navbar />
        
        {children}
      </body> */}
       <AuthProvider>
    <body
        className={monaSans.className}
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
      </AuthProvider>
    </html>
  );
}
