import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    email: { type: String, trim: true, default: "" },
    age: { type: Number, min: 0, max: 150, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
