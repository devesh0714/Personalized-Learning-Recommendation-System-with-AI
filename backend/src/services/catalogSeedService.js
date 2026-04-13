import Domain from "../models/Domain.js";
import Subdomain from "../models/Subdomain.js";
import Topic from "../models/Topic.js";
import { sampleDomains } from "../data/sampleCatalog.js";

const toSubtopic = (title, index, difficulty) => ({
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  difficulty,
  estimatedMinutes: 30,
  order: index + 1
});

export const ensureSampleCatalog = async () => {
  const existingDomainCount = await Domain.estimatedDocumentCount();
  if (existingDomainCount > 0) {
    return;
  }

  for (const domainData of sampleDomains) {
    const domain = await Domain.create({
      name: domainData.name,
      slug: domainData.slug,
      category: domainData.category,
      description: domainData.description,
      goals: domainData.goals,
      order: domainData.order,
      isActive: true
    });

    for (const subdomainData of domainData.subdomains) {
      const subdomain = await Subdomain.create({
        domain: domain._id,
        name: subdomainData.name,
        slug: subdomainData.slug,
        description: subdomainData.description,
        order: subdomainData.order
      });

      for (const topicData of subdomainData.topics) {
        await Topic.create({
          domain: domain._id,
          subdomain: subdomain._id,
          title: topicData.title,
          slug: topicData.slug,
          description: topicData.description,
          difficulty: topicData.difficulty,
          estimatedMinutes: topicData.estimatedMinutes,
          order: topicData.order,
          resources: topicData.resources,
          subtopics: topicData.subtopics.map((title, index) =>
            toSubtopic(title, index, topicData.difficulty)
          )
        });
      }
    }
  }
};
