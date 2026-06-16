import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Performance from "@/components/Performance";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Performance />
        <Experience />
        <Gallery />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
