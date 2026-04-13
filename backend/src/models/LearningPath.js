import mongoose from "mongoose";

const pathTopicSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started"
    },
    order: {
      type: Number,
      default: 0
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { _id: false }
);

const milestoneSchema = new mongoose.Schema(
  {
    subdomain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subdomain",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    topics: {
      type: [pathTopicSchema],
      default: []
    }
  },
  { _id: false }
);

const learningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    goal: {
      type: String,
      default: "Build strong fundamentals and progress step by step."
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active"
    },
    milestones: {
      type: [milestoneSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

learningPathSchema.index({ user: 1, domain: 1 }, { unique: true });
learningPathSchema.index({ user: 1, status: 1 });

const LearningPath = mongoose.model("LearningPath", learningPathSchema);

export default LearningPath;
