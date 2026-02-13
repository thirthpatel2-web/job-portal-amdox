const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.get("/employer", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find()
      .populate({
        path: "job",
        match: { createdBy: req.user.id },
        select: "title company location jobType salary",
      })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    const filtered = applications.filter(app => app.job !== null);

    const result = await Promise.all(
      filtered.map(async (app) => {
        const profile = await Profile.findOne({
          user: app.applicant._id,
        });

        return {
          ...app.toObject(),
          applicantProfile: profile || null,
        };
      })
    );

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/my", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("job", "title company location jobType salary")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/employer/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ createdBy: req.user.id });
    const jobIds = jobs.map(j => j._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds }
    });

    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: "shortlisted"
    });

    const rejected = await Application.countDocuments({
      job: { $in: jobIds },
      status: "rejected"
    });

    const pending = await Application.countDocuments({
      job: { $in: jobIds },
      status: "applied"
    });

    res.json({
      totalJobs: jobs.length,
      totalApplications,
      shortlisted,
      rejected,
      pending
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/seeker/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Access denied" });
    }

    const total = await Application.countDocuments({
      applicant: req.user.id,
    });

    const shortlisted = await Application.countDocuments({
      applicant: req.user.id,
      status: "shortlisted",
    });

    const rejected = await Application.countDocuments({
      applicant: req.user.id,
      status: "rejected",
    });

    const pending = await Application.countDocuments({
      applicant: req.user.id,
      status: "applied",
    });

    res.json({ total, shortlisted, rejected, pending });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status, interviewDate, interviewNote } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "interview",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;

    if (status === "interview") {
      application.interviewDate = interviewDate;
      application.interviewNote = interviewNote;
    }

    await application.save();

    let subject = "";
    let html = "";

    if (status === "shortlisted") {
      subject = "You Have Been Shortlisted 🎉";
      html = `
        <h2>Congratulations ${application.applicant.name}</h2>
        <p>You have been shortlisted for:</p>
        <strong>${application.job.title}</strong>
        <p>Please wait for further updates.</p>
      `;
    }

    if (status === "rejected") {
      subject = "Application Update";
      html = `
        <h2>Application Update</h2>
        <p>We appreciate your interest in:</p>
        <strong>${application.job.title}</strong>
        <p>Unfortunately, you were not selected this time.</p>
      `;
    }

    if (status === "interview") {
      subject = "Interview Scheduled 📅";
      html = `
        <h2>Interview Invitation</h2>
        <p>Hello ${application.applicant.name},</p>
        <p>Your interview for <strong>${application.job.title}</strong> has been scheduled.</p>
        <p><strong>Date:</strong> ${new Date(interviewDate).toLocaleString()}</p>
        <p>${interviewNote || ""}</p>
        <br/>
        <p>Best of luck!</p>
      `;
    }

    if (subject) {
      await sendEmail(
        application.applicant.email,
        subject,
        html
      );
    }

    res.json({
      message: "Status updated",
      application,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:jobId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new Application({
      job: req.params.jobId,
      applicant: req.user.id,
      status: "applied",
    });

    await application.save();

    res.status(201).json({
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
