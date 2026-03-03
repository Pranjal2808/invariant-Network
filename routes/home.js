const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { createCandidate } = require("../models/candidateModel");
const { createJob } = require("../models/jobModel");

const router = express.Router();

const resumesDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeBase = path
      .basename(file.originalname || "resume", ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .slice(0, 60);
    cb(null, `${Date.now()}-${safeBase}${ext || ".pdf"}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", (req, res) => {
  res.render("home", {
    success: req.query.success || "",
    error: req.query.error || "",
  });
});

router.post("/candidates/register", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, years_of_experience, skills } = req.body;

    if (!name || !email || !phone || !years_of_experience || !skills || !req.file) {
      res.redirect("/?error=Please complete all candidate fields, including resume upload.");
      return;
    }

    const years = Number(years_of_experience);
    if (!Number.isInteger(years) || years < 0) {
      res.redirect("/?error=Years of experience must be a non-negative integer.");
      return;
    }

    await createCandidate({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      yearsOfExperience: years,
      skills: skills.trim(),
      resumePath: path.relative(path.join(__dirname, ".."), req.file.path),
    });

    res.redirect("/?success=Candidate registration submitted successfully.");
  } catch (error) {
    if (error && error.code === "SQLITE_CONSTRAINT") {
      res.redirect("/?error=A candidate with this email is already registered.");
      return;
    }

    console.error("Candidate registration error:", error);
    res.redirect("/?error=Unable to submit candidate registration right now.");
  }
});

router.post("/employer/mandate", async (req, res) => {
  try {
    const { company_name, role_title, location, job_description } = req.body;

    if (!company_name || !role_title || !location || !job_description) {
      res.redirect("/?error=Please complete all employer mandate fields.");
      return;
    }

    await createJob({
      title: role_title.trim(),
      company: company_name.trim(),
      location: location.trim(),
      description: job_description.trim(),
    });

    res.redirect("/?success=Employer mandate submitted successfully.");
  } catch (error) {
    console.error("Employer mandate error:", error);
    res.redirect("/?error=Unable to submit employer mandate right now.");
  }
});

module.exports = router;
