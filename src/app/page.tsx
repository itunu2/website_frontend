import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ClientLogos from "@/components/ClientLogos";
import Stats from "@/components/Stats";
import ValueCards from "@/components/ValueCards";
import Services from "@/components/Services";
import HandDrawnArrow from "@/components/HandDrawnArrow";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ClientLogos />
      <Stats />
      {/* position:relative lets HandDrawnArrow (position:absolute inset:0) span both sections */}
      <div style={{ position: "relative" }}>
        <ValueCards />
        <Services />
        <HandDrawnArrow />
      </div>
      <About />
      <CTA />
      <Footer />
    </>
  );
}
