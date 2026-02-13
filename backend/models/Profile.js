const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    bio: {
      type: String,
    },

    skills: {
      type: [String],
    },

    resume: {
      type: String,
    },

    companyName: {
      type: String,
    },

    companyWebsite: {
      type: String,
    },

    companyDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
