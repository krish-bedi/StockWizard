import mongoose from "mongoose";

// Email verification token model
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from creation,
    index: { expires: "1d" }, // Set TTL for 1 day after 'expiresAt'
  },
}, {
  query: {
    maxTimeMS: 10000  // 10 second timeout for queries
  }
});

// This index speeds up token lookups
tokenSchema.index({ token: 1 });  // 1 for ascending order

const Token = mongoose.model("Token", tokenSchema);
export default Token;
