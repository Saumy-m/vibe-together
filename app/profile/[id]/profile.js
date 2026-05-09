"use client";

import Navbar from "../../components/navigation.js";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    interests: "",
    energyLevel: "",
    location: "",
    profilePhoto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [geoCoordinates, setGeoCoordinates] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    if (email && userId) {
      setUserEmail(email);
      setUserId(userId);
      fetchProfile(userId);
    }
  }, []);

  const fetchProfile = async (id) => {
    try {
      const response = await fetch(`/api/profile/${id}`);
      const data = await response.json();

      console.log("API response:", data);

      if (response.ok) {
        setProfileData(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setGeoCoordinates({ latitude, longitude });
        setError("");
        setProfileData((prev) => ({
          ...prev,
          location: `Coordinates captured`,
        }));
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(`Location permission denied: ${error.message}`);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const saveData = {
        email: userEmail,
        ...profileData,
      };

      if (geoCoordinates) {
        saveData.latitude = geoCoordinates.latitude;
        saveData.longitude = geoCoordinates.longitude;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save profile");
        setLoading(false);
        return;
      }

      if (geoCoordinates && data.profile.locationAddress) {
        setProfileData((prev) => ({
          ...prev,
          location: `${data.profile.locationAddress.street || ""}, ${data.profile.locationAddress.city || ""}, ${data.profile.locationAddress.state || ""}`.trim(),
        }));
      }

      setGeoCoordinates(null);
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
      <><Navbar /><main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-6">
      <div className="container-max-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Your Profile
        </h1>

        {error && <div className="error-message mb-4">{error}</div>}

        {!isEditing && (
          <div className="glass-effect bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-md">
            <div className="mb-8 text-center">
              {profileData.profilePhoto ? (
                <div className="inline-block relative">
                  <img
                    src={profileData.profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gradient-to-r from-blue-400 to-purple-500 shadow-xl shadow-blue-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 to-purple-500 opacity-30"></div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-xl">
                  <p className="text-slate-400 font-semibold">No photo</p>
                </div>
              )}
            </div>

            <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                Name
              </p>
              <p className="text-xl text-white font-semibold">
                {profileData.name || "Not set"}
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                Bio
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                {profileData.bio || "Not set"}
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                Interests
              </p>
              <p className="text-lg text-slate-300">
                {profileData.interests || "Not set"}
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                Energy Level
              </p>
              <p className="text-lg">
                {profileData.energyLevel ? (
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 text-blue-300 font-semibold">
                    {profileData.energyLevel}
                  </span>
                ) : (
                  <span className="text-slate-300">Not set</span>
                )}
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">
                Location
              </p>
              <p className="text-lg text-slate-300 mb-3">
                {profileData.location || "Not set"}
              </p>
            </div>

            <button onClick={handleEdit} className="btn-secondary w-full">
              Edit Profile
            </button>
          </div>
        )}

        {isEditing && (
          <form className="form-container" onSubmit={handleSave}>
            <div className="mb-6">
              {profileData.profilePhoto && (
                <div className="mb-4 text-center">
                  <img
                    src={profileData.profilePhoto}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-slate-600" />
                </div>
              )}
              <label className="block text-sm text-slate-400 mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="input-field-light" />
            </div>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={profileData.name}
              onChange={handleChange}
              className="input-field-light" />

            <textarea
              name="bio"
              placeholder="Bio"
              rows="4"
              value={profileData.bio}
              onChange={handleChange}
              className="input-field-light" />

            <input
              type="text"
              name="interests"
              placeholder="Interests (comma separated)"
              value={profileData.interests}
              onChange={handleChange}
              className="input-field-light" />

            <select
              name="energyLevel"
              value={profileData.energyLevel}
              onChange={handleChange}
              className="input-field-light"
            >
              <option value="">Choose energy level</option>
              <option value="Chill">Chill</option>
              <option value="Active">Active</option>
              <option value="Competitive">Competitive</option>
            </select>

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="City/Location (e.g., New York, Los Angeles)"
                value={profileData.location}
                onChange={handleChange}
                className="input-field-light" />
              <button
                type="button"
                onClick={requestGeolocation}
                className="btn-secondary mt-2 w-full"
              >
                {geoCoordinates ? "Location Captured" : "Auto-Detect Location"}
              </button>
            </div>

            <button
              type="submit"
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </main></>
    
  );
}