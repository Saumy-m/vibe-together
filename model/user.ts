import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
      trim: true,
    },
    energyLevel: {
      type: String,
      default: "",
      enum: ["", "Chill", "Active", "Competitive"],
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },

    locationGeoJSON: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    locationAddress: {
      house: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

UserSchema.index({ "locationGeoJSON.coordinates": "2dsphere" });

export default mongoose.models.User || mongoose.model("User", UserSchema);