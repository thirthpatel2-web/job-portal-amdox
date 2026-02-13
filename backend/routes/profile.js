const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email", "role"]
    );

    res.json(profile); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/", auth, async (req, res) => {
  try {
    const {
      phone,
      bio,
      skills,
      companyName,
      companyWebsite,
      companyDescription,
    } = req.body;

    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({ user: req.user.id });
    }

    if (phone) profile.phone = phone;

    if (bio) profile.bio = bio;
    if (skills) profile.skills = skills;

    if (companyName) profile.companyName = companyName;
    if (companyWebsite) profile.companyWebsite = companyWebsite;
    if (companyDescription) profile.companyDescription = companyDescription;

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
const storage = multer.diskStorage({
  destination: "uploads/resumes",
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"));
    }
  },
});

router.post(
  "/resume",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      profile.resume = req.file.path;
      await profile.save();

      res.json({
        message: "Resume uploaded successfully",
        resume: profile.resume,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
module.exports = router;

