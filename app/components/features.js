export default function FeatureCard({ title, description }) {
  return (
    <div className="card-light">
      <h3 className="heading-h3-card">{title}</h3>
      <p className="text-secondary">{description}</p>
    </div>
  );
}