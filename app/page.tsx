import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import Logos from '@/components/public/Logos';
import About from '@/components/public/About';
import Portfolio from '@/components/public/Portfolio';
import Services from '@/components/public/Services';
import Testimonials from '@/components/public/Testimonials';
import Blog from '@/components/public/Blog';
import Booking from '@/components/public/Booking';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';

export default function Home() {
  return (
    <main className="main-obsidian">
      <Navbar />
      <Hero />
      <Logos />
      <About />
      <Portfolio />
      <Services />
      <Testimonials />
      <Blog />
      <Booking />
      <Contact />
      <Footer />
    </main>
  );
}
