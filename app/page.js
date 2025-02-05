import Image from "next/image";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/Services";
import ContactPage from "@/components/Contact";
import Footer from "@/components/Footer";
import CTASection from "@/components/Cta";
import TestimonialSection from "@/components/Testimonial";
export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <CTASection />
      <TestimonialSection />
      <ContactPage />
      <Footer />
    </>
  );
}
