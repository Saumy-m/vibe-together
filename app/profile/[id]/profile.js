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

// list of activiteies for user to select
const ACTIVITIES = [
  { id: "hiking",        label: "Hiking" },
  { id: "cycling",       label: "Cycling" },
  { id: "camping",       label: "Camping" },
  { id: "kayaking",      label: "Kayaking" },
  { id: "rock_climbing", label: "Rock Climbing" },
  { id: "painting",      label: "Painting" },
  { id: "photography",   label: "Photography" },
  { id: "pottery",       label: "Pottery" },
  { id: "writing",       label: "Creative Writing" },
  { id: "music",         label: "Playing Music" },
  { id: "cooking",       label: "Cooking" },
  { id: "wine_tasting",  label: "Wine Tasting" },
  { id: "board_games",   label: "Board Games" },
  { id: "karaoke",       label: "Karaoke" },
  { id: "coffee",        label: "Coffee Crawls" },
  { id: "yoga",          label: "Yoga" },
  { id: "running",       label: "Running" },
  { id: "gym",           label: "Gym / Weightlifting" },
  { id: "meditation",    label: "Meditation" },
  { id: "dance",         label: "Dancing" },
  { id: "coding",        label: "Coding / Hackathons" },
  { id: "book_club",     label: "Book Club" },
  { id: "language",      label: "Language Exchange" },
  { id: "gaming",        label: "Video Gaming" },
  { id: "film",          label: "Film / Documentaries" },
];

const activityLabel = (id) =>
  ACTIVITIES.find((a) => a.id === id)?.label ?? id.replace(/_/g, " ");

// function to execute activity selection and updation when updating user profile
function ActivityDropdown({ interests, onChange, placeholder = "Choose your interests…" }) {
  const [isOpen, setIsOpen]      = useState(false);
  const [searchQuery, setSearch] = useState("");
  const containerRef             = useRef(null);
  const searchRef                = useRef(null);

  const triggerLabel =
    interests.length === 0
      ? placeholder
      : interests.length === 1
      ? "1 activity selected"
      : `${interests.length} activities selected`;

  const filtered = searchQuery.trim()
    ? ACTIVITIES.filter((a) =>
        a.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ACTIVITIES;

  const handleToggle = useCallback(
    (id) => {
      const next = interests.includes(id)
        ? interests.filter((x) => x !== id)
        : [...interests, id];
      onChange(next);
    },
    [interests, onChange]
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) searchRef.current.focus();
  }, [isOpen]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "10px 14px",
          background: "rgba(51,65,85,0.5)",
          border: isOpen ? "1.5px solid #818cf8" : "1.5px solid rgba(100,116,139,0.5)",
          borderRadius: "10px",
          color: interests.length ? "#e2e8f0" : "#94a3b8",
          fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit",
          boxShadow: isOpen ? "0 0 0 3px rgba(129,140,248,0.2)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          textAlign: "left", gap: "8px",
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ flex: 1 }}>{triggerLabel}</span>
        {interests.length > 0 && (
          <span style={{
            background: "#7c5cbf", color: "#fff", borderRadius: "99px",
            fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px",
            minWidth: "22px", textAlign: "center",
          }}>
            {interests.length}
          </span>
        )}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            zIndex: 300, background: "#1e293b",
            border: "1.5px solid rgba(100,116,139,0.4)", borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            display: "flex", flexDirection: "column", maxHeight: "360px",
            overflow: "hidden", animation: "vtDropIn 0.13s ease",
          }}
          onKeyDown={(e) => { if (e.key === "Escape") setIsOpen(false); }}
        >
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", padding: "10px 12px",
            borderBottom: "1px solid rgba(100,116,139,0.3)", position: "relative" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2}
              style={{ position: "absolute", left: 22, width: 15, height: 15, pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef} type="text" value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: "100%", padding: "7px 30px 7px 34px",
                background: "rgba(51,65,85,0.6)",
                border: "1px solid rgba(100,116,139,0.4)", borderRadius: "7px",
                color: "#e2e8f0", fontSize: "0.85rem", fontFamily: "inherit", outline: "none",
              }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearch("")}
                style={{ position: "absolute", right: 20, background: "none", border: "none",
                  color: "#94a3b8", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>
                ×
              </button>
            )}
          </div>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "6px 14px", background: "rgba(15,23,42,0.5)",
            borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
            <span style={{ fontSize: "0.77rem", color: "#94a3b8", fontWeight: 500 }}>
              {interests.length} selected
            </span>
            {interests.length > 0 && (
              <button type="button" onClick={() => onChange([])}
                style={{ background: "none", border: "none", color: "#818cf8",
                  fontSize: "0.77rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Clear all
              </button>
            )}
          </div>

          {/* Flat list */}
          <ul style={{ listStyle: "none", margin: 0, padding: "6px 0", overflowY: "auto", flex: 1 }}
            role="listbox" aria-multiselectable="true">
            {filtered.length === 0 ? (
              <li style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                No activities match "{searchQuery}"
              </li>
            ) : filtered.map((activity) => {
              const checked = interests.includes(activity.id);
              return (
                <li key={activity.id} role="option" aria-selected={checked}>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 14px", cursor: "pointer", userSelect: "none",
                    fontSize: "0.88rem",
                    color: checked ? "#a5b4fc" : "#cbd5e1",
                    fontWeight: checked ? 500 : 400,
                    background: checked ? "rgba(129,140,248,0.1)" : "transparent",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "rgba(129,140,248,0.07)"; }}
                  onMouseLeave={(e) => { if (!checked) e.currentTarget.style.background = "transparent"; }}
                  >
                    <input
                      type="checkbox" checked={checked}
                      onChange={() => handleToggle(activity.id)}
                      style={{ accentColor: "#818cf8", width: 15, height: 15,
                        cursor: "pointer", flexShrink: 0 }}
                    />
                    {activity.label}
                    {checked && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth={2.5}
                        style={{ width: 13, height: 13, marginLeft: "auto", flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(100,116,139,0.3)",
            background: "rgba(15,23,42,0.5)", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setIsOpen(false)} style={{
              padding: "7px 20px",
              background: "linear-gradient(135deg, #6366f1, #7c5cbf)",
              color: "#fff", border: "none", borderRadius: "7px",
              fontSize: "0.85rem", fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            }}>
              Done
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes vtDropIn { from { opacity:0; transform:translateY(-5px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}

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

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
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

  const loggedInUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
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