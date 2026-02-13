const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
   
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["jobseeker", "employer"],
      required: true,
    },

    phone: {
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
    companyDescription: {
      type: String,
    },
    website: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
