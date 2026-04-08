import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
    actionUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
