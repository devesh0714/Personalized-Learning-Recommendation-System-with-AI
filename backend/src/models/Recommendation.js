import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain"
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    },
    source: {
      type: String,
      enum: ["rule-based", "ai"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    nextTopic: {
      title: { type: String, default: "" },
      difficulty: { type: String, default: "" },
      subdomain: { type: String, default: "" }
    },
    actionUrl: {
      type: String,
      default: ""
    },
    aiPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

recommendationSchema.index({ user: 1, source: 1, createdAt: -1 });
recommendationSchema.index({ user: 1, domain: 1 });

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
