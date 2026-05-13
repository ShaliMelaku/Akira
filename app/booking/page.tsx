import Navbar from '@/components/public/Navbar';
import Booking from '@/components/public/Booking';
import Footer from '@/components/public/Footer';

export default function BookingPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-120">
        <Booking />
      </div>
      <Footer />
    </main>
  );
}
