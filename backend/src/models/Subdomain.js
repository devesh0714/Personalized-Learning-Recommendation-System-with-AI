import mongoose from "mongoose";

const subdomainSchema = new mongoose.Schema(
  {
    domain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Domain",
      required: true
    },
    name: {
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
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

subdomainSchema.index({ domain: 1, slug: 1 }, { unique: true });
subdomainSchema.index({ domain: 1, order: 1 });

const Subdomain = mongoose.model("Subdomain", subdomainSchema);

export default Subdomain;
