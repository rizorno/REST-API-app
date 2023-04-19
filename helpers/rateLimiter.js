const rateLimit = require("express-rate-limit");

const registerLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  handler: (req, res, next) => {
    return res.status(403).json({
      message:
        "Too many attempts to register. Not more than two times per hour from one IP.",
    });
  },
});

const reguestLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 500,
  handler: (_req, res, _next) => {
    return res.status(403).json({
      message: "Too many requests, please try again later.",
    });
  },
});

module.exports = { registerLimit, reguestLimit };
