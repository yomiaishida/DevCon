require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const validateRuntimeConfig = require("./config/validateEnv");
const connectDB = require("./config/db");

const app = express();

validateRuntimeConfig();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowAllOrigins = allowedOrigins.length === 0;

  if (allowAllOrigins) {
    res.header("Access-Control-Allow-Origin", "*");
  } else if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  if (!allowAllOrigins && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ msg: "CORS origin denied" });
  }

  return next();
});

app.get("/healthz", (_, res) => res.status(200).json({ status: "ok" }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
const clientBuildPath = path.resolve(__dirname, "client", "build");
if (process.env.NODE_ENV === "production" && fs.existsSync(clientBuildPath)) {
  // Set static folder
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
