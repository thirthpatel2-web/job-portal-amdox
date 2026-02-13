const express = require("express");
const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const authMiddlewareOptional = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return next();

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
  } catch (err) {
  }

  next();
};
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = new Job({
      ...req.body,
      createdBy: req.user.id,
    });

    await job.save();
    res.status(201).json(job);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job listing" });
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job listing" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", authMiddlewareOptional, async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      page = 1,
      limit = 6,
      sort = "newest",
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    let sortOption = { createdAt: -1 };

    if (sort === "salary-high") {
      sortOption = { salary: -1 };
    }

    if (sort === "salary-low") {
      sortOption = { salary: 1 };
    }

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("createdBy", "name email role")
      .sort(sortOption)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    let resultJobs = jobs;

    if (req.user && req.user.role === "jobseeker") {
      const applications = await Application.find({
        applicant: req.user.id,
      });

      const appliedIds = applications.map(a => a.job.toString());

      resultJobs = jobs.map(job => ({
        ...job.toObject(),
        alreadyApplied: appliedIds.includes(job._id.toString()),
      }));
    }

    res.json({
      jobs: resultJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / pageSize),
      totalJobs,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
