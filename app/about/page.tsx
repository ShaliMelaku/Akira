import Navbar from '@/components/public/Navbar';
import About from '@/components/public/About';
import Footer from '@/components/public/Footer';
import PageHeader from '@/components/public/PageHeader';

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <PageHeader 
        subtitle="the story"
        title="Behind the"
        italic="Presence"
        desc="Discover the journey of Akira—from a passionate voice artist to an award-winning performance visionary."
      />
      <About />
      <Footer />
    </main>
  );
}
