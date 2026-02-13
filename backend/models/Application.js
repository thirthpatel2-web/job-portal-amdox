const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
  type: String,
  enum: ["pending", "shortlisted", "rejected"],
  default: "pending",
},interviewDate: {
  type: Date,
},

interviewNote: {
  type: String,
},


    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "interview"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
