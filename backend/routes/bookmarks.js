const express = require("express");
const Bookmark = require("../models/Bookmark");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/:jobId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can bookmark" });
    }

    const existing = await Bookmark.findOne({
      user: req.user.id,
      job: req.params.jobId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Job removed from saved" });
    }

    const bookmark = new Bookmark({
      user: req.user.id,
      job: req.params.jobId,
    });

    await bookmark.save();

    res.json({ message: "Job saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookmarks = await Bookmark.find({
      user: req.user.id,
    }).populate({
      path: "job",
      populate: {
        path: "createdBy",
        select: "name email",
      },
    });

    const jobs = bookmarks.map((bookmark) => bookmark.job);

    res.json(jobs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
