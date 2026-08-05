"use client";
// Login Page imports
import Navbar from "../components/navigation.js";
import { useState } from "react";
import { useRouter } from "next/navigation";


// Login Page Component
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  //  Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send login data to the backend API
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userId", data.user.id);
      router.push(`/profile/${data.user.id}`);
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  // Handle input changes for the login form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-6">
        <div className="card-dark">
          <h1 className="heading-h1-page">Log In</h1>

          {error && <div className="error-message">{error}</div>}

          <form className="form-container" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />

            <button
              type="submit"
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}