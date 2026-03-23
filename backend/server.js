const express = require("express");
const cors = require("cors");
const employeeRoutes = require("./routes/employees");

const app = express();
const PORT = 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/employees", employeeRoutes);

// Root health check
app.get("/", (req, res) => {
  res.json({ message: "Employee Management API is running." });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
