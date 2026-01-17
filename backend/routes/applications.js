const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/applications/:jobId
// @desc    Apply for a job (Job seeker only)
// @access  Private
router.post("/:jobId", authMiddleware, async (req, res) => {
  try {
    // Only job seekers can apply
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const jobId = req.params.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.userId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.userId,
    });

    await application.save();

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// @route   GET /api/applications/employer
// @desc    Get applications for jobs created by employer
// @access  Private (Employer only)
router.get("/employer", authMiddleware, async (req, res) => {
  try {
    // Only employers allowed
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find()
      .populate({
        path: "job",
        match: { createdBy: req.user.userId },
        select: "title company location jobType",
      })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    // Remove applications where job is null (not owned by employer)
    const filteredApplications = applications.filter(
      (app) => app.job !== null
    );

    res.status(200).json(filteredApplications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// @route   GET /api/applications/my
// @desc    Get jobs applied by logged-in job seeker
// @access  Private (Job seeker only)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    // Only job seekers allowed
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      applicant: req.user.userId,
    })
      .populate("job", "title company location jobType")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
