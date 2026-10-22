"use client";

/* Signup Page imports */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navigation.js";
import ActivityDropdown, { activityLabel } from "../components/activities/ActivityDropdown";

/* Signup Page Component
 * `selectedInterests` stores the stable activity IDs used by both profile editing
 * and matching. The dropdown reports changes; this page submits them to the API.
 */
export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    bio: "",
    energyLevel: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);

  /* Handle form submission for signup */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* Send signup data to the backend API */
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
          interests: selectedInterests,
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

      /* Alert user of registration completion and redirect to profile */
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

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">
                Interests
                <span style={{ fontWeight: 400, color: "#64748b", fontSize: "0.8rem" }}> — pick as many as you like</span>
              </label>
              <ActivityDropdown
                interests={selectedInterests}
                onChange={setSelectedInterests}
              />
              
               {/* Selected activity preview: uses the same IDs as the dropdown. */}
               {selectedInterests.length > 0 && (
                 <div className="flex flex-wrap gap-1.5 mt-2.5">
                   {selectedInterests.map((actId) => (
                     <span key={actId} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/15 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                       {activityLabel(actId)}
                       <button
                         type="button"
                         className="text-indigo-400 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
                         onClick={() => setSelectedInterests((previous) => previous.filter((id) => id !== actId))}
                         aria-label={`Remove ${activityLabel(actId)}`}
                       >
                         ×
                       </button>
                     </span>
                   ))}
                 </div>
               )}
            </div>

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