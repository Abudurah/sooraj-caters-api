import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token need for autherization !"],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "User also need for autherization!"],
    },
    type: {
      type: String,
      enum: ["passwordReset", "Auth"],
      default: "Auth",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 10259200,
    },
  },
  { timestamps: true }
);

export const Tokens = mongoose.model("Tokens", newsSchema);
