const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // THIS IS THE FIX
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error("JWT ERROR >>>", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
