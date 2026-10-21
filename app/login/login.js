"use client";

// Login Page imports
import Navbar from "../components/navigation.js";
import { useState } from "react";
import { useRouter } from "next/navigation";


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
          email: formData.email,
          password: formData.password,
        }),
      });

      // stores the login status from response object to json format
      const data = await response.json();

      // stores error message if login fails and stops loading state
      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userId", data.user.id);

      // redirects to the user's profile page after successful login
      router.push(`/profile/${data.user.id}`);
    } 
    // checks for errors during the login process and logs them to the console
    catch (error) {
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