import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  currentLevel: user.currentLevel,
  selectedDomains: user.selectedDomains
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, bio, currentLevel } = req.body;

    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      password,
      bio,
      currentLevel
    });

    res.status(201).json({
      success: true,
      data: {
        token: generateToken(user._id),
        user: serializeUser(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    res.json({
      success: true,
      data: {
        token: generateToken(user._id),
        user: serializeUser(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("selectedDomains.domain", "name slug category");

  res.json({
    success: true,
    data: serializeUser(user)
  });
};
