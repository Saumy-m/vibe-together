// "use client";

// import Navbar from "../../components/navigation.js";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";

// export default function ProfilePage() {
//   const { id } = useParams(); // ✅ reads the [id] from the URL directly
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: "",
//     bio: "",
//     interests: "",
//     energyLevel: "",
//     location: "",
//     profilePhoto: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [geoCoordinates, setGeoCoordinates] = useState(null);

//   useEffect(() => {
//     const email = localStorage.getItem("userEmail");
//     if (email) setUserEmail(email);

//     // ✅ Use id from URL params, not localStorage
//     if (id) fetchProfile(id);
//   }, [id]); // ✅ re-runs if id changes (e.g. viewing another user's profile)

//   const fetchProfile = async (profileId) => {
//     try {
//       const response = await fetch(`/api/profile/${profileId}`);
//       const data = await response.json();

//       console.log("API response:", data);

//       if (response.ok) {
//         setProfileData(data.user); // ✅ was data.profile — fixed to data.user
//       } else {
//         setError(data.message || "Failed to load profile");
//       }
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       setError("Something went wrong loading the profile");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileData((prev) => ({ ...prev, profilePhoto: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const requestGeolocation = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported by your browser");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setGeoCoordinates({ latitude, longitude });
//         setError("");
//       },
//       (error) => {
//         console.error("Geolocation error:", error.code, error.message);
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             setError("Location permission denied. Please enable it in your browser settings.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             setError("Location information is unavailable right now.");
//             break;
//           case error.TIMEOUT:
//             setError("Getting your location took too long. Please try again.");
//             break;
//           default:
//             setError("An unknown error occurred while getting your location.");
//         }
//       },
//       { timeout: 10000, enableHighAccuracy: false } // bump timeout, maybe drop high accuracy
//     );
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const saveData = {
//         email: userEmail,
//         ...profileData,
//       };

//       if (geoCoordinates) {
//         saveData.latitude = geoCoordinates.latitude;
//         saveData.longitude = geoCoordinates.longitude;
//         delete saveData.location; 
//       }

//       const response = await fetch(`/api/profile/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(saveData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Failed to save profile");
//         setLoading(false);
//         return;
//       }

//       if (geoCoordinates && data.profile.locationAddress) {
//         setProfileData((prev) => ({
//           ...prev,
//           location: `${data.profile.locationAddress.street || ""}, ${data.profile.locationAddress.city || ""}, ${data.profile.locationAddress.state || ""}`.trim(),
//         }));
//       }

//       setGeoCoordinates(null);
//       setIsEditing(false);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       setError("Something went wrong");
//       setLoading(false);
//     }
//   };

//   const handleEdit = () => setIsEditing(true);

//   // ✅ Only show Edit button if viewing your own profile
//   const loggedInUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//   const isOwnProfile = loggedInUserId === id;

//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-6">
//         <div className="container-max-md">
//           <h1 className="text-3xl font-bold text-white mb-6 text-center">
//             {isOwnProfile ? "Your Profile" : `${profileData.name}'s Profile`}
//           </h1>

//           {error && <div className="error-message mb-4">{error}</div>}

//           {!isEditing && (
//             <div className="glass-effect bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-md">
//               <div className="mb-8 text-center">
//                 {profileData.profilePhoto ? (
//                   <div className="inline-block relative">
//                     <img
//                       src={profileData.profilePhoto}
//                       alt="Profile"
//                       className="w-32 h-32 rounded-full object-cover border-2 border-gradient-to-r from-blue-400 to-purple-500 shadow-xl shadow-blue-500/20"
//                     />
//                     <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 to-purple-500 opacity-30"></div>
//                   </div>
//                 ) : (
//                   <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-xl">
//                     <p className="text-slate-400 font-semibold">No photo</p>
//                   </div>
//                 )}
//               </div>

//               <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
//                 <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Name</p>
//                 <p className="text-xl text-white font-semibold">{profileData.name || "Not set"}</p>
//               </div>

//               <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
//                 <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Bio</p>
//                 <p className="text-lg text-slate-300 leading-relaxed">{profileData.bio || "Not set"}</p>
//               </div>

//               <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
//                 <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Interests</p>
//                 <p className="text-lg text-slate-300">{profileData.interests || "Not set"}</p>
//               </div>

//               <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
//                 <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Energy Level</p>
//                 <p className="text-lg">
//                   {profileData.energyLevel ? (
//                     <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 text-blue-300 font-semibold">
//                       {profileData.energyLevel}
//                     </span>
//                   ) : (
//                     <span className="text-slate-300">Not set</span>
//                   )}
//                 </p>
//               </div>

//               <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
//                 <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Location</p>
//                 <p className="text-lg text-slate-300">{profileData.location || "Not set"}</p>
//               </div>

//               {/* ✅ Only show Edit button on your own profile */}
//               {isOwnProfile && (
//                 <button onClick={handleEdit} className="btn-secondary w-full">
//                   Edit Profile
//                 </button>
//               )}
//             </div>
//           )}

//           {isEditing && isOwnProfile && (
//             <form className="form-container" onSubmit={handleSave}>
//               <div className="mb-6">
//                 {profileData.profilePhoto && (
//                   <div className="mb-4 text-center">
//                     <img
//                       src={profileData.profilePhoto}
//                       alt="Profile Preview"
//                       className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-slate-600"
//                     />
//                   </div>
//                 )}
//                 <label className="block text-sm text-slate-400 mb-2">Profile Photo</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="input-field-light"
//                 />
//               </div>

//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={profileData.name}
//                 onChange={handleChange}
//                 className="input-field-light"
//               />

//               <textarea
//                 name="bio"
//                 placeholder="Bio"
//                 rows="4"
//                 value={profileData.bio}
//                 onChange={handleChange}
//                 className="input-field-light"
//               />

//               <input
//                 type="text"
//                 name="interests"
//                 placeholder="Interests (comma separated)"
//                 value={profileData.interests}
//                 onChange={handleChange}
//                 className="input-field-light"
//               />

//               <select
//                 name="energyLevel"
//                 value={profileData.energyLevel}
//                 onChange={handleChange}
//                 className="input-field-light"
//               >
//                 <option value="">Choose energy level</option>
//                 <option value="Chill">Chill</option>
//                 <option value="Active">Active</option>
//                 <option value="Competitive">Competitive</option>
//               </select>

//               <div className="mb-6">
//                 <label className="block text-sm text-slate-400 mb-2">Location</label>
//                 <input
//                   type="text"
//                   name="location"
//                   placeholder="City/Location (e.g., New York, Los Angeles)"
//                   value={profileData.location}
//                   onChange={handleChange}
//                   className="input-field-light"
//                 />
//                 <button
//                   type="button"
//                   onClick={requestGeolocation}
//                   className="btn-secondary mt-2 w-full"
//                 >
//                   {geoCoordinates ? "Location Captured" : "Auto-Detect Location"}
//                 </button>
//               </div>

//               <button type="submit" className="btn-secondary" disabled={loading}>
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//             </form>
//           )}
//         </div>
//       </main>
//     </>
//   );
// }

"use client";

//import statements
import Navbar from "../../components/navigation.js";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import ActivityDropdown, { activityLabel } from "../../components/interests.js";


// ─── ProfilePage ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name:         "",
    bio:          "",
    interests:    [],   // ← always an array; replaces the old comma string
    energyLevel:  "",
    location:     "",
    profilePhoto: "",
  });
  const [loading, setLoading]          = useState(false);
  const [error,   setError]            = useState("");
  const [userEmail, setUserEmail]      = useState("");
  const [geoCoordinates, setGeoCoords] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
    setLoggedInUserId(localStorage.getItem("userId"));
    if (id) fetchProfile(id);
  }, [id]);

  const fetchProfile = async (profileId) => {
    try {
      const response = await fetch(`/api/profile/${profileId}`);
      const data     = await response.json();
      console.log("API response:", data);

      if (response.ok) {
        setProfileData({
          ...data.user,
          // Normalise interests: real array → keep, comma string → split, missing → []
          interests: Array.isArray(data.user.interests)
            ? data.user.interests
            : typeof data.user.interests === "string" && data.user.interests
            ? data.user.interests.split(",").map((s) => s.trim())
            : [],
        });
      } else {
        setError(data.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Something went wrong loading the profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setProfileData((prev) => ({ ...prev, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  // Instant update on every checkbox tick — writes directly into interests
  const handleInterestsChange = (updatedInterests) => {
    setProfileData((prev) => ({ ...prev, interests: updatedInterests }));
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setGeoCoords({ latitude, longitude });
        setError("");
      },
      (err) => {
        const msgs = {
          [err.PERMISSION_DENIED]:    "Location permission denied. Please enable it in your browser settings.",
          [err.POSITION_UNAVAILABLE]: "Location information is unavailable right now.",
          [err.TIMEOUT]:              "Getting your location took too long. Please try again.",
        };
        setError(msgs[err.code] || "An unknown error occurred while getting your location.");
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // interests is already the array — spreads straight into saveData
      const saveData = { email: userEmail, ...profileData };

      if (geoCoordinates) {
        saveData.latitude  = geoCoordinates.latitude;
        saveData.longitude = geoCoordinates.longitude;
        delete saveData.location;
      }

      const response = await fetch(`/api/profile/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(saveData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to save profile");
        setLoading(false);
        return;
      }

      if (geoCoordinates && data.profile.locationAddress) {
        const { street = "", city = "", state = "" } = data.profile.locationAddress;
        setProfileData((prev) => ({
          ...prev,
          location: `${street}, ${city}, ${state}`.trim(),
        }));
      }

      setGeoCoords(null);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const isOwnProfile   = loggedInUserId === id;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-6">
        <div className="container-max-md">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            {isOwnProfile ? "Your Profile" : `${profileData.name}'s Profile`}
          </h1>

          {error && <div className="error-message mb-4">{error}</div>}

          {/* ── VIEW MODE ── */}
          {!isEditing && (
            <div className="glass-effect bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-md">

              <div className="mb-8 text-center">
                {profileData.profilePhoto ? (
                  <div className="inline-block relative">
                    <img src={profileData.profilePhoto} alt="Profile"
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
                <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Name</p>
                <p className="text-xl text-white font-semibold">{profileData.name || "Not set"}</p>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Bio</p>
                <p className="text-lg text-slate-300 leading-relaxed">{profileData.bio || "Not set"}</p>
              </div>

              {/* Interests displayed as pills */}
              <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <p className="text-sm text-slate-400 font-semibold mb-3 uppercase tracking-wider">Interests</p>
                {profileData.interests?.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {profileData.interests.map((id) => (
                      <span key={id} style={{
                        padding: "4px 12px",
                        background: "rgba(129,140,248,0.15)",
                        border: "1px solid rgba(129,140,248,0.35)",
                        borderRadius: "99px", color: "#a5b4fc",
                        fontSize: "0.82rem", fontWeight: 600, textTransform: "capitalize",
                      }}>
                        {activityLabel(id)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-slate-300">Not set</p>
                )}
              </div>

              <div className="mb-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Energy Level</p>
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
                <p className="text-sm text-slate-400 font-semibold mb-2 uppercase tracking-wider">Location</p>
                <p className="text-lg text-slate-300">{profileData.location || "Not set"}</p>
              </div>

              {isOwnProfile && (
                <button onClick={() => setIsEditing(true)} className="btn-secondary w-full">
                  Edit Profile
                </button>
              )}
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {isEditing && isOwnProfile && (
            <form className="form-container" onSubmit={handleSave}>

              <div className="mb-6">
                {profileData.profilePhoto && (
                  <div className="mb-4 text-center">
                    <img src={profileData.profilePhoto} alt="Profile Preview"
                      className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-slate-600" />
                  </div>
                )}
                <label className="block text-sm text-slate-400 mb-2">Profile Photo</label>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="input-field-light" />
              </div>

              <input type="text" name="name" placeholder="Name"
                value={profileData.name} onChange={handleChange} className="input-field-light" />

              <textarea name="bio" placeholder="Bio" rows="4"
                value={profileData.bio} onChange={handleChange} className="input-field-light" />

              {/* ── Interests dropdown (replaces old text input) ── */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">
                  Interests
                  <span style={{ fontWeight: 400, color: "#64748b", fontSize: "0.8rem" }}> — pick as many as you like</span>
                </label>
                <ActivityDropdown
                  interests={profileData.interests}
                  onChange={handleInterestsChange}
                />
                {/* Live pill preview with quick-remove */}
                {profileData.interests?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                    {profileData.interests.map((actId) => (
                      <span key={actId} style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        padding: "3px 10px",
                        background: "rgba(129,140,248,0.15)",
                        border: "1px solid rgba(129,140,248,0.3)",
                        borderRadius: "99px", color: "#a5b4fc",
                        fontSize: "0.78rem", fontWeight: 600, textTransform: "capitalize",
                      }}>
                        {activityLabel(actId)}
                        <button type="button"
                          onClick={() => handleInterestsChange(profileData.interests.filter((x) => x !== actId))}
                          style={{ background: "none", border: "none", color: "#818cf8",
                            cursor: "pointer", fontSize: "0.9rem", lineHeight: 1, padding: 0 }}
                          aria-label={`Remove ${activityLabel(actId)}`}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <select name="energyLevel" value={profileData.energyLevel}
                onChange={handleChange} className="input-field-light">
                <option value="">Choose energy level</option>
                <option value="Chill">Chill</option>
                <option value="Active">Active</option>
                <option value="Competitive">Competitive</option>
              </select>

              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Location</label>
                <input type="text" name="location"
                  placeholder="City/Location (e.g., New York, Los Angeles)"
                  value={profileData.location} onChange={handleChange} className="input-field-light" />
                <button type="button" onClick={requestGeolocation} className="btn-secondary mt-2 w-full">
                  {geoCoordinates ? "✓ Location Captured" : "Auto-Detect Location"}
                </button>
              </div>

              <button type="submit" className="btn-secondary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

        </div>
      </main>
    </>
  );
}