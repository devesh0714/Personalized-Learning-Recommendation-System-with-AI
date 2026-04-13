import mongoose from "mongoose";

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

const subtopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: difficultyLevels,
      default: "Beginner"
    },
    estimatedMinutes: {
      type: Number,
      min: 0,
      default: 30
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { _id: true }
);

const topicSchema = new mongoose.Schema(
  {
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true
    },
    subdomain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subdomain",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    difficulty: {
      type: String,
      enum: difficultyLevels,
      default: "Beginner"
    },
    estimatedMinutes: {
      type: Number,
      min: 0,
      default: 60
    },
    order: {
      type: Number,
      default: 0
    },
    resources: [
      {
        label: { type: String, required: true },
        url: { type: String, default: "" }
      }
    ],
    subtopics: {
      type: [subtopicSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

topicSchema.index({ subdomain: 1, slug: 1 }, { unique: true });
topicSchema.index({ domain: 1, subdomain: 1, order: 1 });
topicSchema.index({ domain: 1, difficulty: 1 });

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
