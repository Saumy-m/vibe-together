"use client";

// Login Page imports
import Navbar from "../components/navigation.js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";


// Login Page Component
export default function LoginPage() {
  // connect router for page navigation
  const router = useRouter();

  // input field state management
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
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      // Convert API response to JSON
      const data = await response.json();

      // Handle login failure
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Ensure login response contains the user's UUID
      if (!data.user?.id) {
        setError("User information missing from login response");
        return;
      }

      // Redirect the authenticated user to their profile
      router.push(`/profile/${data.user.id}`);
      //router.refresh();

    } catch (error) {
      // Handle unexpected request or network errors
      console.error("Login error:", error);
      setError("Something went wrong");

    } finally {
      // Reset loading state after request completion
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

      <main className="login-input-frame">
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