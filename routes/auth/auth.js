const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.send("A token is required for authentication");
    res.status(403);
    res.end();
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
     res.send("Invalid Token");
     res.status(401);
     res.end();
  }
  return next();
};

module.exports = verifyToken;