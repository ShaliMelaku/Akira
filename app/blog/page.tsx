import Navbar from '@/components/public/Navbar';
import Blog from '@/components/public/Blog';
import Footer from '@/components/public/Footer';

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-120">
        <Blog />
      </div>
      <Footer />
    </main>
  );
}
