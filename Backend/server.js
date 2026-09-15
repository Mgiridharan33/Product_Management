import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import commonRoutes from "./src/routes/index.js";
import {initDatabase} from "./src/config/db.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves uploaded product images statically, e.g. GET /uploads/123.jpg
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api", commonRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `No route for ${req.method} ${req.originalUrl}` });
});

// Central error handler. Any controller that calls next(err) ends up here.
app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.code === "23505") {
    return res.status(409).json({ success: false, message: "A record with the same unique value already exists." });
  }
  if (err.code === "23503") {
    return res.status(409).json({ success: false, message: "Related record does not exist or cannot be deleted." });
  }

  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

initDatabase()
  .then(() => {
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  });
