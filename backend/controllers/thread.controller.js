const mongoose = require("mongoose");
const Thread = require("../models/thread.model");
const User = require("../models/user.model");

const createThread = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const id = req.user.user._id;
    const owner = await User.findOne({ _id: id });
    const newThread = new Thread({
      title,
      description,
      category,
      owner,
    });
    const savedThread = await newThread.save();
    res
      .status(201)
      .json({ message: "Thread created successfully", thread: savedThread }); // Update response format
  } catch (err) {
    console.log("Error while Creating thread", err.message);
    return res.status(500).json({ message: "Error while Creating Thread" }); // Set appropriate error status code
  }
};

const getOwnerThreads = async (req, res) => {
  try {
    const userId = req.user.user._id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    const threads = await Thread.find({ owner: userId });

    return res.status(200).json({ threads });
  } catch (err) {
    console.error("Error while getting threads:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find().populate("owner", "username");
    console.log("threads", threads);
    return res.status(200).json({ threads, status: true });
  } catch (err) {
    console.error("Error while getting threads:", err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

const getFilterThreads = async (req, res) => {
  try {
    const { category, owner } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }
    if (owner) {
      query.owner = owner;
    }

    const filteredThreads = await Thread.find({ $and: [query] });

    return res.status(200).json({ filteredThreads, status: true });
  } catch (error) {
    console.log("Error: ", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", status: false });
  }
};

const getAllCategories = async (req, res) => {
  try {
  } catch (err) {}
};

module.exports = {
  createThread,
  getOwnerThreads,
  getAllThreads,
  getFilterThreads,
};
