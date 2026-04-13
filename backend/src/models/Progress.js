import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
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
    subdomain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subdomain"
    },
    topicRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic"
    },
    topic: {
      type: String,
      required: true,
      trim: true
    },
    subtopic: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    timeSpentMinutes: {
      type: Number,
      min: 0,
      default: 0
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

progressSchema.index({ user: 1, topicRef: 1 }, { unique: true, sparse: true });
progressSchema.index({ user: 1, topic: 1 });
progressSchema.index({ user: 1, domain: 1, updatedAt: -1 });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
