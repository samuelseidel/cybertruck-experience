import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import VideoStrip from "@/components/VideoStrip";
import Vouchers from "@/components/Vouchers";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Schedule />
        <VideoStrip />
        <Vouchers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
