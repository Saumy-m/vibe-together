// // Signup API route for handling user registration
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectToDatabase } from "@/lib/mongodb";
// import User from "@/model/user";
// import { createClient } from "@/lib/supabase/server";

// // Initialize supabase client for signup
// const supabase = await createClient();

// // Handle POST request for user signup
// export async function POST(req) {
//   try {
//     const { name, email, password, bio, interests, energyLevel } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { message: "Password must be at least 6 characters" },
//         { status: 400 }
//       );
//     }

//     // Connect to the database and check if the user already exists
//     await connectToDatabase();
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 409 }
//       );
//     }

//     // Hash the password before saving the user to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user in the database
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name,
//           bio,
//           interests,
//           energyLevel,
//         },
//       },
//     });


// // export async function POST(req) {
// //   try {
// //     // Extract submitted signup data.
// //     const {
// //       name,
// //       email,
// //       password,
// //       bio,
// //       interests,
// //       energyLevel
// //     } = await req.json();

// //     // Validate required fields and their types.
// //     if (
// //       typeof name !== "string" || !name.trim() ||
// //       typeof email !== "string" || !email.trim() ||
// //       typeof password !== "string"
// //     ) {
// //       return NextResponse.json(
// //         { message: "Name, email and password are required." },
// //         { status: 400 }
// //       );
// //     }

// //     // Validate password length.
// //     // This should match the Supabase Auth password policy.
// //     if (password.length < 8) {
// //       return NextResponse.json(
// //         { message: "Password must be at least 8 characters." },
// //         { status: 400 }
// //       );
// //     }

// //     // Validate the interest selection format.
// //     if (
// //       interests !== undefined &&
// //       (!Array.isArray(interests) ||
// //         !interests.every(item => typeof item === "string"))
// //     ) {
// //       return NextResponse.json(
// //         { message: "Invalid interests format." },
// //         { status: 400 }
// //       );
// //     }

// //     // Create a user through Supabase Auth.
// //     // Supabase handles password hashing and account uniqueness.
// //     const { data, error } = await supabase.auth.signUp({
// //       email: email.trim(),
// //       password,
// //       options: {
// //         data: {
// //           name: name.trim(),
// //           bio: typeof bio === "string" ? bio : "",
// //           interests: interests ?? [],
// //           energyLevel: energyLevel ?? "",
// //         },
// //       },
// //     });

//     // Handle expected authentication errors.
//     if (error) {
//       console.error("Supabase Auth error:", {
//         code: error.code,
//         status: error.status,
//       });

//       if (error.status === 429) {
//         return NextResponse.json(
//           { message: "Too many attempts. Please try later." },
//           { status: 429 }
//         );
//       }

//       if (["weak_password", "validation_failed",
//            "email_address_invalid"].includes(error.code)) {
//         return NextResponse.json(
//           { message: "Please check your signup details and password." },
//           { status: 400 }
//         );
//       }

//       if (["user_already_exists", "email_exists"].includes(error.code)) {
//         return NextResponse.json(
//           {
//             message:
//               "If you already have an account, please sign in or reset your password.",
//           },
//           { status: 400 }
//         );
//       }

//       // Use the provider's status to distinguish server-side
//       // failures from other authentication errors.
//       return NextResponse.json(
//         { message: "Unable to complete signup. Please try again." },
//         { status: error.status >= 500 ? 503 : 400 }
//       );
//     }

// //     // A successful request may still require email verification.
// //     // It also does not automatically populate public.profiles.
// //     return NextResponse.json(
// //       {
// //         message:
// //           "If registration can be completed, check your email for the next steps.",
// //         requiresEmailConfirmation: !data.session,
// //       },
// //       { status: 200 }
// //     );

// //   } catch (err) {
// //     // Handle unexpected exceptions.
// //     console.error("Unexpected signup failure:", err);

// //     return NextResponse.json(
// //       { message: "An unexpected error occurred." },
// //       { status: 500 }
// //     );
// //   }
// // }


//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       bio: bio || "",
//       interests: interests || "",
//       energyLevel: energyLevel || "",
//     });

//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         user: {
//           id: newUser._id,
//           name: newUser.name,
//           email: newUser.email,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handle POST request for user signup.
export async function POST(req) {
  try {
    // Initialize a Supabase client for this request.
    const supabase = await createClient();

    // Extract information from the signup form.
    const {
      name,
      email,
      password,
      bio,
      interests,
      energyLevel
    } = await req.json();

    // Validate required fields.
    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    // Check password requirements.
    // Match this value to your Supabase Auth settings.
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Validate the user's selected activities.
    if (
      interests !== undefined &&
      (!Array.isArray(interests) ||
        !interests.every(id => typeof id === "string"))
    ) {
      return NextResponse.json(
        { message: "Invalid interests format." },
        { status: 400 }
      );
    }

    // Request user creation through Supabase Auth.
    // Password hashing is managed by Supabase.
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          bio: typeof bio === "string" ? bio : "",
          interests: interests ?? [],
          energyLevel: energyLevel ?? "",
        },
      },
    });

    // Handle errors returned by Supabase Auth.
    if (error) {
      console.error("Supabase signup error:", {
        code: error.code,
        status: error.status,
      });

      if (error.status === 429) {
        return NextResponse.json(
          { message: "Too many signup attempts. Try again later." },
          { status: 429 }
        );
      }

      if (
        ["weak_password", "validation_failed",
         "email_address_invalid"].includes(error.code)
      ) {
        return NextResponse.json(
          { message: "Please check your signup information." },
          { status: 400 }
        );
      }

      if (
        ["user_already_exists", "email_exists"].includes(error.code)
      ) {
        return NextResponse.json(
          {
            message:
              "If you already have an account, please sign in or reset your password.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "Unable to complete signup. Please try again." },
        { status: error.status >= 500 ? 503 : 400 }
      );
    }

    // Supabase accepted the signup request.
    // Email verification may still be required.
    return NextResponse.json(
      {
        message:
          "If registration can be completed, check your email for the next steps.",
        requiresEmailConfirmation: !data.session,
      },
      { status: 200 }
    );

  } catch (err) {
    // Handle unexpected failures.
    console.error("Unexpected signup failure:", err);

    return NextResponse.json(
      { message: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
