const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/jobs
// @desc    Create a new job (Employer only)
// @access  Private
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Only employers can create jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, company, location, jobType, salary } = req.body;

    const job = new Job({
      title,
      description,
      company,
      location,
      jobType,
      salary,
      createdBy: req.user.userId,
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// @route   GET /api/jobs
// @desc    Get all jobs with search & filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { keyword, location, jobType } = req.query;

    let query = {};

    // Keyword search (title or description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
