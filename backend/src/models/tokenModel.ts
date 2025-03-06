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
  type: {
    type: String,
    enum: ['refresh', 'verification', 'reset'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: function(this: { type: string }) {
      if (this.type === 'refresh') {
        return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days for refresh
      }
      if (this.type === 'verification') {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days for verification
      }
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for password reset
    },
    required: true
  }
}, {
  query: {
    maxTimeMS: 10000  // 10 second timeout for queries
  }
});

// Create TTL index
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// This index speeds up token lookups
tokenSchema.index({ token: 1, type: 1 });  // 1 for ascending order

const Token = mongoose.model("Token", tokenSchema);

// Force index creation
Token.createIndexes().then(() => {
  console.log('Token indexes created successfully');
}).catch(err => {
  console.error('Error creating token indexes:', err);
});

export default Token;
