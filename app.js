const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");
const { reguestLimit } = require("./helpers/rateLimiter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const maxSizeKiloByte = 1 * 1024 * 10; // 10KB in bytes

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: maxSizeKiloByte }));
app.use(express.static("public"));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: reguestLimit,
});
app.use("/api/", apiLimiter);
app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File too large! Maximum 2Mb" });
  }
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
