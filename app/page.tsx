import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
