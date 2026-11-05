
// import statements
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/model/user";
import { createClient } from "@/lib/supabase/server";

// function to identify location from latitude longtitude coordinates
// used LocationIQ API to Reverse Geocode coordinates to Location Data
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

    // Extract relevant address components from the response
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

// responds to Get Requests from the user loading the users profile 
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    //await connectToDatabase();
    const supabase = await createClient();


    // Fetch the user profile from the database, excluding sensitive fields
    const { data: user, error: err } = await supabase.from("profiles").select("*").eq("id", id).single();

    //console.log("Supabase fetch result:", user, err);

    if (err) {
      console.error("Supabase fetch error:", err);
      if (err.code === "401") {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      }
      else if (err.code === "404") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: "Error fetching user profile", error: err.message },
        { status: 500 }
      );

    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          name: user.name,
          bio: user.bio,
          interests: user.interests, 
          energyLevel: user.energy_level,
          profilePhoto: user.profile_photo,
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

// recieves user request for login or profile updates
export async function PUT(req) {


  try {
     const {
      name,
      bio,
      interests,   
      energyLevel,
      profilePhoto,
      latitude,
      longitude,
      location,
    } = await req.json();

    //console.log("Completed request body access");

    // if (!email) {
    //   return NextResponse.json(
    //     { message: "Email is required" },
    //     { status: 400 }
    //   );
    // }

    //await connectToDatabase();

    const supabase = await createClient();

    const {data: fetchuser, error: err} = await supabase.auth.getUser();
    if (err) {
      console.error("Supabase auth error:", err);
      if (err.code === "401") {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      }
      else if (err.code === "404") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Error fetching user" },
        { status: 500 }
      );
    }

    // Prepare the update data object with the provided fields
    const updateData = {
      name:         name         || fetchuser.user?.user_metadata?.name,
      bio:          bio          || fetchuser.user?.user_metadata?.bio,
      interests: Array.isArray(interests) ? interests : [],
      energy_level:  energyLevel  || fetchuser.user?.user_metadata?.energy_level,
      profile_photo: profilePhoto || fetchuser.user?.user_metadata?.profile_photo,
      location_address:     location     || fetchuser.user?.user_metadata?.location_address,
    };

    if (latitude && longitude) {
      updateData.location_address = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      const addressData = await reverseGeocodeLocation(latitude, longitude);
      if (addressData) {
        updateData.location_address = addressData;
        updateData.location = [addressData.street, addressData.city, addressData.state]
          .filter(Boolean)
          .join(", ");
      }
    }

    //const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
    const{data: updatedUser, error: updateErr} = await supabase.from("profiles").update(updateData).eq("id", fetchuser.user?.id).select().single();
    if (updateErr) {
      console.error("Supabase update error:", updateErr);
      if (updateErr.code === "401") {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      }
      else if (updateErr.code === "404") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Error updating profile" },
        { status: 500 }
      );
    }

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        profile: {
          name:            updatedUser.name,
          bio:             updatedUser.bio,
          interests:       updatedUser.interests,   
          energy_level:     updatedUser.energy_level,
          profile_photo:    updatedUser.profile_photo,
          location:        updatedUser.location,
          location_address: updatedUser.location_address,
          // locationGeoJSON: updatedUser.locationGeoJSON,
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