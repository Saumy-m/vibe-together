import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="section-hero">
      <div className="container-max-lg text-center">
        <h1 className="heading-h1-large">
          Find people who match your interests and energy
        </h1>

        <p className="mt-6 text-description-light">
          VibeTogether helps people connect through shared activities, similar
          vibes, and meaningful conversations — all in one place.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>

          <Link href="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}