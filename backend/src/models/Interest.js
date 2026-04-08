import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  {
    timestamps: true
  }
);

interestSchema.index({ user: 1, name: 1 }, { unique: true });

const Interest = mongoose.model("Interest", interestSchema);

export default Interest;
