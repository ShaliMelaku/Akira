import Navbar from '@/components/public/Navbar';
import Services from '@/components/public/Services';
import Footer from '@/components/public/Footer';
import PageHeader from '@/components/public/PageHeader';

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <PageHeader 
        subtitle="elite offerings"
        title="Bespoke"
        italic="Services"
        desc="Tailored creative solutions spanning voice artistry, stage performance, and strategic brand influence."
      />
      <Services />
      <Footer />
    </main>
  );
}
