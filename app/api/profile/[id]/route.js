import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/model/user";

async function reverseGeocodeLocation(latitude, longitude) {
  try {
    const locationIQApiKey = process.env.LOCATIONIQ_API_KEY;

    if (!locationIQApiKey) {
      console.warn("LOCATIONIQ_API_KEY not configured");
      return null;
    }

    const url = `https://us1.locationiq.com/v1/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=18&normalizeaddress=1&key=${locationIQApiKey}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      console.error("LocationIQ API error:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.address) {
      const address = data.address;
      return {
        street:
          address.house_number && address.road
            ? `${address.house_number} ${address.road}`
            : address.building || address.amenity || address.shop || "",
        city:
          address.city || address.town || address.village || address.hamlet || "",
        state: address.state || address.county || address.province || "",
        country: address.country || "",
        zipCode: address.postcode || "",
      };
    }

    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

// ✅ Added { params } to read the [id] from the URL path
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ was searchParams.get("id") — that reads ?id= query string, not the URL segment

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(id).select(
      "-password -locationAddress -locationGeoJSON -email -__v"
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Changed "profile" to "user" to match what profile.js expects (data.user)
    return NextResponse.json(
      {
        user: {
          name: user.name,
          bio: user.bio,
          interests: user.interests,
          energyLevel: user.energyLevel,
          profilePhoto: user.profilePhoto,
          location: user.location,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const {
      email,
      name,
      bio,
      interests,
      energyLevel,
      profilePhoto,
      latitude,
      longitude,
      location,
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData = {
      name: name || "",
      bio: bio || "",
      interests: interests || "",
      energyLevel: energyLevel || "",
      profilePhoto: profilePhoto || "",
      location: location || "",
    };

    if (latitude && longitude) {
      updateData.locationGeoJSON = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      const addressData = await reverseGeocodeLocation(latitude, longitude);
      if (addressData) {
        updateData.locationAddress = addressData;
      }
    }

    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        profile: {
          name: user.name,
          bio: user.bio,
          interests: user.interests,
          energyLevel: user.energyLevel,
          profilePhoto: user.profilePhoto,
          location: user.location,
          locationAddress: user.locationAddress,
          locationGeoJSON: user.locationGeoJSON,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}