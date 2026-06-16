import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Booking from "@/components/Booking";
import VideoStrip from "@/components/VideoStrip";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Booking />
        <VideoStrip />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
