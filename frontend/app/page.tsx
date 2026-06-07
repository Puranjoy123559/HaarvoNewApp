// This is the home page (URL "/") — Next.js automatically renders this for the root URL
// We just stack our components together to build the full page
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Standardize from "@/components/Standardize";
import Steps from "@/components/Steps";
import Features from "@/components/Features";
import FpoShift  from "@/components/FpoShift";
// import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Standardize />
      <Steps />
      <Features />
      <FpoShift  />
      {/* <Testimonial /> */}
      <CTA />
      <Footer />
    </main>
  );
}
