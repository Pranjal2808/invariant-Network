const path = require("path");
const express = require("express");
require("dotenv").config();

const { initSchema } = require("./models/schema");
const { seedDefaultJobs } = require("./models/jobModel");
const homeRoutes = require("./routes/home");
const jobsRoutes = require("./routes/jobs");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRoutes);
app.use("/jobs", jobsRoutes);
app.use("/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  await initSchema();
  await seedDefaultJobs();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
