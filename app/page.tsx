import Navbar from "./components/navigation.js";
import HeroSection from "./components/content.js";
import FeatureCard from "./components/features.js";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar />

      <HeroSection />

      <section className="section-features">
        <div className="container-max-lg">
          <h2 className="heading-h2-section">What VibeTogether offers</h2>

          <div className="grid-features">
            <FeatureCard
              title="Smart Matching"
              description="Discover people with similar activity interests and matching energy levels."
            />

            <FeatureCard
              title="Personal Profiles"
              description="Create a profile that reflects who you are, what you enjoy, and how you like to connect."
            />

            <FeatureCard
              title="Built-in Chat"
              description="Stay connected through daily conversations without needing another social media app."
            />
          </div>
        </div>
      </section>
    </main>
  );
}