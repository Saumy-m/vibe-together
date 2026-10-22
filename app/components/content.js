import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="section-hero">
      <div className="homepage-content-container">
        <h1 className="heading-h1-large">
          Find your circle, master your craft, feel at home.
        </h1>

        <p className="Homepage-descript">
          VibeTogether helps people connect through shared activities, similar
          vibes, and meaningful conversations — all in one place.
        </p>

        <div className="homepage-buttons-container">
          <Link href="/signup" className="nav-button-prim">
            Get Started
          </Link>

          <Link href="/login" className="nav-button-sec">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}