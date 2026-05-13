import Navbar from '@/components/public/Navbar';
import Portfolio from '@/components/public/Portfolio';
import Footer from '@/components/public/Footer';
import PageHeader from '@/components/public/PageHeader';

export default function PortfolioPage() {
  return (
    <main>
      <Navbar />
      <PageHeader 
        subtitle="curated collections"
        title="Cinematic"
        italic="Portfolio"
        desc="A showcase of visual and auditory masterpieces crafted for global brands and independent cinema."
      />
      <Portfolio />
      <Footer />
    </main>
  );
}
