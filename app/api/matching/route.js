import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/model/user";

// ─── LOCATION NORMALIZER ─────────────────────────────────────
// Your schema stores coordinates in GeoJSON format: [longitude, latitude]
// The matching algorithm needs: { lat, lon }
function normalizeLocation(user) {
  if (
    user.locationGeoJSON?.coordinates?.length === 2 &&
    typeof user.locationGeoJSON.coordinates[0] === "number" &&
    typeof user.locationGeoJSON.coordinates[1] === "number"
  ) {
    return {
      lon: user.locationGeoJSON.coordinates[0], // GeoJSON is [lon, lat]
      lat: user.locationGeoJSON.coordinates[1],
    };
  }
  return null;
}

// ─── PURE FUNCTIONS ──────────────────────────────────────────

function extractInterests(interestsString) {
  if (!interestsString || typeof interestsString !== "string") {
    return [];
  }
  return interestsString
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getCommonInterests(userInterests, targetInterests) {
  return userInterests.filter((interest) => targetInterests.includes(interest));
}

function calculateMatchPercentage(userInterests, commonInterests) {
  if (!userInterests.length) return 0;
  return Math.round((commonInterests.length / userInterests.length) * 100);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isNearby(userLocation, targetLocation, maxDistanceKm = 50) {
  if (
    !userLocation ||
    !targetLocation ||
    typeof userLocation.lat !== "number" ||
    typeof userLocation.lon !== "number" ||
    typeof targetLocation.lat !== "number" ||
    typeof targetLocation.lon !== "number"
  ) {
    return false;
  }

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    targetLocation.lat,
    targetLocation.lon
  );

  return distance <= maxDistanceKm;
}

const ONLINE_INTERESTS = new Set([
  "movies", "music", "gaming", "video gaming", "anime", "streaming",
  "reading", "coding", "digital art", "art", "podcasts", "youtube",
  "netflix", "tv shows", "films", "series",
]);

function getOnlineCommonInterests(commonInterests) {
  return commonInterests.filter((interest) => ONLINE_INTERESTS.has(interest));
}

function getEnergyBonus(userEnergy, targetEnergy) {
  if (!userEnergy || !targetEnergy) return 0;
  return userEnergy === targetEnergy ? 5 : 0;
}

function classifyMatches(currentUser, potentialMatches, options = {}) {
  const { maxDistanceKm = 50 } = options;
  const currentUserInterests = extractInterests(currentUser.interests);

  const nearbyMatches = [];
  const onlineMatches = [];

  for (const match of potentialMatches) {
    const targetInterests = extractInterests(match.interests);
    const commonInterests = getCommonInterests(currentUserInterests, targetInterests);
    const matchPercentage = calculateMatchPercentage(currentUserInterests, commonInterests);
    const onlineCommonInterests = getOnlineCommonInterests(commonInterests);
    const energyBonus = getEnergyBonus(currentUser.energyLevel, match.energyLevel);

    let distanceKm = null;
    if (
      currentUser.location && match.location &&
      typeof currentUser.location.lat === "number" &&
      typeof currentUser.location.lon === "number" &&
      typeof match.location.lat === "number" &&
      typeof match.location.lon === "number"
    ) {
      distanceKm = calculateDistance(
        currentUser.location.lat,
        currentUser.location.lon,
        match.location.lat,
        match.location.lon
      );
    }

    const nearby = isNearby(currentUser.location, match.location, maxDistanceKm);

    const baseMatch = {
      _id: match._id,
      name: match.name,
      bio: match.bio || "",
      interests: match.interests || "",
      location: match.location || null,
      energyLevel: match.energyLevel || "",
      profilePhoto: match.profilePhoto || "",
      matchPercentage,
      commonInterests,
      onlineCommonInterests,
      nearby,
      distanceKm: distanceKm !== null ? Math.round(distanceKm) : null,
      finalScore: matchPercentage + energyBonus,
    };

    if (nearby && matchPercentage >= 60) {
      nearbyMatches.push({ ...baseMatch, matchType: "nearby" });
      continue;
    }

    if (matchPercentage >= 30 && onlineCommonInterests.length > 0) {
      onlineMatches.push({ ...baseMatch, matchType: "online" });
    }
  }

  nearbyMatches.sort((a, b) => b.finalScore - a.finalScore);
  onlineMatches.sort((a, b) => b.finalScore - a.finalScore);

  return { nearbyMatches, onlineMatches };
}

// ─── HELPER: normalize a raw Mongoose user doc ───────────────
function normalizeUser(userDoc) {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  return {
    ...user,
    location: normalizeLocation(user),
  };
}

// ─── POST HANDLER ────────────────────────────────────────────
export async function POST(req) {
  try {
    const { email, maxDistanceKm } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const currentUserDoc = await User.findOne({ email });

    if (!currentUserDoc) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const potentialMatchDocs = await User.find(
      { email: { $ne: email } },
      "-password"
    );

    // ✅ Normalize both current user and all matches before classifying
    const currentUser = normalizeUser(currentUserDoc);
    const potentialMatches = potentialMatchDocs.map(normalizeUser);

    const { nearbyMatches, onlineMatches } = classifyMatches(
      currentUser,
      potentialMatches,
      { maxDistanceKm: Number(maxDistanceKm) || 50 }
    );

    return NextResponse.json(
      {
        message: "Matches retrieved successfully",
        currentUserProfile: {
          name: currentUser.name,
          interests: currentUser.interests,
          location: currentUser.location,
          energyLevel: currentUser.energyLevel,
        },
        nearbyCount: nearbyMatches.length,
        onlineCount: onlineMatches.length,
        nearbyMatches: nearbyMatches.slice(0, 10),
        onlineMatches: onlineMatches.slice(0, 10),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

// ─── GET HANDLER ─────────────────────────────────────────────
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const maxDistanceKm = Number(searchParams.get("maxDistanceKm")) || 50;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const currentUserDoc = await User.findOne({ email });

    if (!currentUserDoc) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const potentialMatchDocs = await User.find(
      { email: { $ne: email } },
      "-password"
    );

    // ✅ Normalize both current user and all matches before classifying
    const currentUser = normalizeUser(currentUserDoc);
    const potentialMatches = potentialMatchDocs.map(normalizeUser);

    const { nearbyMatches, onlineMatches } = classifyMatches(
      currentUser,
      potentialMatches,
      { maxDistanceKm }
    );

    return NextResponse.json(
      {
        message: "Matches retrieved successfully",
        nearbyCount: nearbyMatches.length,
        onlineCount: onlineMatches.length,
        nearbyMatches: nearbyMatches.slice(0, 10),
        onlineMatches: onlineMatches.slice(0, 10),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}