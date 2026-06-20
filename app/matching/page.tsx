"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navigation";

interface LocationAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface Match {
  _id: string;
  name: string;
  bio: string;
  profilePhoto: string;
  interests: string;
  energyLevel: string;
  location: string | null;
  commonInterests: string[];
  matchPercentage: number;
  matchType: "nearby" | "online";
  distanceKm?: number | null;
}

export default function MatchingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"nearby" | "online" | "all">(
    "nearby"
  );
  const [nearbyMatches, setNearbyMatches] = useState<Match[]>([]);
  const [onlineMatches, setOnlineMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      router.push("/login");
    } else {
      fetchMatches(userEmail);
    }
  }, [router]);

  const fetchMatches = async (email: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          maxDistanceKm: 50,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch matches");
        setLoading(false);
        return;
      }

      setNearbyMatches(data.nearbyMatches || []);
      setOnlineMatches(data.onlineMatches || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const getDisplayMatches = () => {
    if (activeTab === "nearby") return nearbyMatches;
    if (activeTab === "online") return onlineMatches;
    return [...nearbyMatches, ...onlineMatches];
  };

  const displayMatches = getDisplayMatches();

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <p className="text-slate-300 mt-4">Loading matches...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            Find Your Match
          </h1>
          <p className="text-slate-400 text-center mb-8">
            Discover people who share your interests and energy
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-4 mb-8 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab("nearby")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "nearby"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Nearby Matches ({nearbyMatches.length})
            </button>

            <button
              onClick={() => setActiveTab("online")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "online"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Online Matches ({onlineMatches.length})
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All Matches ({nearbyMatches.length + onlineMatches.length})
            </button>
          </div>

          {displayMatches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">
                No matches found in this category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayMatches.map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  onViewProfile={() => setSelectedMatch(match)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedMatch && (
        <ProfileOverlay
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
}

function MatchCard({
  match,
  onViewProfile,
}: {
  match: Match;
  onViewProfile: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-lg overflow-hidden border border-slate-700/50 backdrop-blur-md hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20">
      <div className="relative">
        {match.profilePhoto ? (
          <img
            src={match.profilePhoto}
            alt={match.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-slate-500 text-sm">No photo</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          {match.matchPercentage}% Match
        </div>

        <div className="absolute top-3 left-3">
          <span className="inline-block px-2 py-1 rounded bg-slate-900/80 text-slate-200 text-xs font-semibold">
            {match.matchType === "nearby" ? "Nearby" : "Online"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{match.name}</h3>

        {match.energyLevel && (
          <p className="text-sm text-slate-400 mb-2">
            Energy: <span className="text-blue-300">{match.energyLevel}</span>
          </p>
        )}

        {match.distanceKm !== null && match.distanceKm !== undefined && (
          <p className="text-sm text-slate-400 mb-2">
            Distance:{" "}
            <span className="text-blue-300">{match.distanceKm} km</span>
          </p>
        )}

        {match.bio && (
          <p className="text-sm text-slate-300 mb-3 line-clamp-2">
            {match.bio}
          </p>
        )}

        {match.commonInterests.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2 font-semibold uppercase">
              Common Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {match.commonInterests.slice(0, 3).map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-semibold"
                >
                  {interest}
                </span>
              ))}
              {match.commonInterests.length > 3 && (
                <span className="inline-block px-2 py-1 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs font-semibold">
                  +{match.commonInterests.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onViewProfile}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-600/50"
          >
            View Profile
          </button>

          <button className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold transition-all">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileOverlay({
  match,
  onClose,
}: {
  match: Match;
  onClose: () => void;
}) {
  // Close on Escape key, and lock background scroll while open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 max-w-md w-full max-h-[85vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close profile"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/70 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-all"
        >
          ✕
        </button>

        {match.profilePhoto ? (
          <img
            src={match.profilePhoto}
            alt={match.name}
            className="w-full h-56 object-cover rounded-t-xl"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center rounded-t-xl">
            <span className="text-slate-500 text-sm">No photo</span>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-center justify-between mb-2 gap-3">
            <h2 className="text-xl font-bold text-white">{match.name}</h2>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
              {match.matchPercentage}% Match
            </span>
          </div>

          <div className="mb-3">
            <span className="inline-block px-2 py-1 rounded bg-slate-700/50 text-slate-300 text-xs font-semibold">
              {match.matchType === "nearby" ? "Nearby" : "Online"}
            </span>
          </div>

          {match.energyLevel && (
            <p className="text-sm text-slate-400 mb-1">
              Energy: <span className="text-blue-300">{match.energyLevel}</span>
            </p>
          )}

          {match.distanceKm !== null && match.distanceKm !== undefined && (
            <p className="text-sm text-slate-400 mb-3">
              Distance:{" "}
              <span className="text-blue-300">{match.distanceKm} km</span>
            </p>
          )}

          {match.bio && (
            <p className="text-sm text-slate-300 mb-4 leading-relaxed whitespace-pre-line">
              {match.bio}
            </p>
          )}

          {match.commonInterests.length > 0 && (
            <div className="mb-1">
              <p className="text-xs text-slate-400 mb-2 font-semibold uppercase">
                Common Interests
              </p>
              <div className="flex flex-wrap gap-2">
                {match.commonInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-semibold"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
