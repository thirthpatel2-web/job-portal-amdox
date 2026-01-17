const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Connect to database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Job Portal API is running");
});
// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
