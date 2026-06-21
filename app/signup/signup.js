"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navigation.js";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    interests: "",
    energyLevel: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          bio: formData.bio,
          interests: formData.interests,
          energyLevel: formData.energyLevel,
        }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (!response.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userId", data.user.id);
      alert("Account created successfully!");
      router.push(`/profile/${data.user.id}`);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-6 py-10">
        <div className="card-dark">
          <h1 className="heading-h1-page">Sign Up</h1>

          {error && <div className="error-message mb-4">{error}</div>}

          <form className="form-container" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />

            <textarea
              name="bio"
              placeholder="Bio (optional)"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="text"
              name="interests"
              placeholder="Interests - comma separated (optional)"
              value={formData.interests}
              onChange={handleChange}
              className="input-field"
            />

            <select
              name="energyLevel"
              value={formData.energyLevel}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Choose energy level (optional)</option>
              <option value="Chill">Chill</option>
              <option value="Active">Active</option>
              <option value="Competitive">Competitive</option>
            </select>

            <button
              type="submit"
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}