import mongoose from "mongoose";
import Domain from "../models/Domain.js";
import Subdomain from "../models/Subdomain.js";
import Topic from "../models/Topic.js";
import { ensureSampleCatalog } from "../services/catalogSeedService.js";

const buildTree = (domain, subdomains, topics) => ({
  ...domain.toObject(),
  subdomains: subdomains
    .filter((subdomain) => String(subdomain.domain) === String(domain._id))
    .map((subdomain) => ({
      ...subdomain.toObject(),
      topics: topics.filter((topic) => String(topic.subdomain) === String(subdomain._id))
    }))
});

export const getDomains = async (_req, res, next) => {
  try {
    await ensureSampleCatalog();

    const domains = await Domain.find({ isActive: true }).sort({ order: 1, name: 1 });
    const domainIds = domains.map((domain) => domain._id);
    const [subdomains, topics] = await Promise.all([
      Subdomain.find({ domain: { $in: domainIds } }).sort({ order: 1, name: 1 }),
      Topic.find({ domain: { $in: domainIds } }).sort({ order: 1, title: 1 })
    ]);

    res.json({
      success: true,
      data: domains.map((domain) => buildTree(domain, subdomains, topics))
    });
  } catch (error) {
    next(error);
  }
};

export const getDomain = async (req, res, next) => {
  try {
    await ensureSampleCatalog();

    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    const domain = await Domain.findOne({ ...query, isActive: true });

    if (!domain) {
      const error = new Error("Domain not found");
      error.statusCode = 404;
      throw error;
    }

    const [subdomains, topics] = await Promise.all([
      Subdomain.find({ domain: domain._id }).sort({ order: 1, name: 1 }),
      Topic.find({ domain: domain._id }).sort({ order: 1, title: 1 })
    ]);

    res.json({ success: true, data: buildTree(domain, subdomains, topics) });
  } catch (error) {
    next(error);
  }
};
