// login backend imports
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/model/user";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Handle POST request for user login
export async function POST(req) {
  try {
    // const { email, password } = await req.json();

    // if (!email || !password) {
    //   return NextResponse.json(
    //     { message: "Email and password are required" },
    //     { status: 400 }
    //   );
    // }

    // // await connectToDatabase();
    // // const user = await User.findOne({ email });

    // if (!user) {
    //   return NextResponse.json(
    //     { message: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // // Compare the provided password with the hashed password in the database
    // const passwordMatch = await bcrypt.compare(password, user.password);

    // if (!passwordMatch) {
    //   return NextResponse.json(
    //     { message: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    const { email, password } = await req.json();

    const supabase = await createClient();
    //console.log(supabase);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Login result:", {
      hasUser: Boolean(data?.user),
      hasSession: Boolean(data?.session),
      errorCode: error?.code,
    });

    // Handle errors returned by Supabase Auth.
    if (error) {
      console.error("Login error:", {
        code: error.code,
        status: error.status,
      });

      if (error.code === "invalid_credentials") {
        return NextResponse.json(
          { message: "Invalid email or password." },
          { status: 401 }
        );
      }

      if (error.code === "email_not_confirmed") {
        return NextResponse.json(
          { message: "Please verify your email before logging in." },
          { status: 403 }
        );
      }

      if (error.status === 429) {
        return NextResponse.json(
          { message: "Too many login attempts. Try again later." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { message: "Login unavailable. Please try again." },
        { status: error.status >= 500 ? 503 : 400 }
      );
    }


    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}