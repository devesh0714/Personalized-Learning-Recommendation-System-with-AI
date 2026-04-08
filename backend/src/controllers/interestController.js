import Interest from "../models/Interest.js";

export const getInterests = async (req, res, next) => {
  try {
    const interests = await Interest.find({ user: req.user._id }).sort({ priority: -1, name: 1 });
    res.json({ success: true, data: interests });
  } catch (error) {
    next(error);
  }
};

export const saveInterests = async (req, res, next) => {
  try {
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      const error = new Error("Interests must be an array");
      error.statusCode = 400;
      throw error;
    }

    await Interest.deleteMany({ user: req.user._id });

    const records = interests.map((interest) => ({
      user: req.user._id,
      name: interest.name,
      category: interest.category,
      priority: interest.priority || 3
    }));

    const saved = records.length ? await Interest.insertMany(records) : [];

    res.json({
      success: true,
      data: saved
    });
  } catch (error) {
    next(error);
  }
};
