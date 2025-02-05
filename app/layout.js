import { Mona_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";


const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "QR Chain",
  description: "Where Authenticity Meets Innovation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={monaSans.className}
      >
        <Navbar />
        
        {children}
      </body>
    </html>
  );
}
