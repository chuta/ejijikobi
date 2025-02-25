import AnimatedHero from './components/AnimatedHero';
import Features from './components/Features';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnimatedHero />
      <Features />
      <Footer />
    </main>
  );
}
