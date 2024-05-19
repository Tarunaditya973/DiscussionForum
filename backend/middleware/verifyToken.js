const jwt = require("jsonwebtoken"); // Ensure you have jwt installed
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // You can access user info from the decoded token
  } catch (err) {
    console.log(err);
    return res.status(401).send(`${err.message}`);
  }

  return next();
};

module.exports = verifyToken;
