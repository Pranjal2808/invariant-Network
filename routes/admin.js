const express = require("express");
const { requireAdminAuth } = require("../services/adminAuth");
const { rowsToCsv } = require("../services/csv");
const { createJob, getJobById, getJobsWithApplicationCount } = require("../models/jobModel");
const { getApplicationsByJobId } = require("../models/applicationModel");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("admin-login", {
    error: req.query.error || "",
  });
});

router.post("/login", (req, res) => {
  const submittedPassword = String(req.body.password || "");
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me";

  if (submittedPassword === adminPassword) {
    req.session.isAdmin = true;
    res.redirect("/admin");
    return;
  }

  res.redirect("/admin/login?error=Invalid password.");
});

router.post("/logout", requireAdminAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

router.get("/", requireAdminAuth, async (req, res, next) => {
  try {
    const jobs = await getJobsWithApplicationCount();
    res.render("admin-dashboard", {
      jobs,
      success: req.query.success || "",
      error: req.query.error || "",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/jobs", requireAdminAuth, async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    if (!title || !company || !location || !description) {
      res.redirect("/admin?error=All job fields are required.");
      return;
    }

    await createJob({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
    });

    res.redirect("/admin?success=Job created successfully.");
  } catch (error) {
    console.error("Admin create job error:", error);
    res.redirect("/admin?error=Unable to create job right now.");
  }
});

router.get("/jobs/:id/applications", requireAdminAuth, async (req, res, next) => {
  try {
    const jobId = Number(req.params.id);
    if (!Number.isInteger(jobId) || jobId <= 0) {
      res.status(400).send("Invalid job id.");
      return;
    }

    const job = await getJobById(jobId);
    if (!job) {
      res.status(404).send("Job not found.");
      return;
    }

    const applications = await getApplicationsByJobId(jobId);
    res.render("admin-applications", { job, applications });
  } catch (error) {
    next(error);
  }
});

router.get("/jobs/:id/applications/export", requireAdminAuth, async (req, res, next) => {
  try {
    const jobId = Number(req.params.id);
    if (!Number.isInteger(jobId) || jobId <= 0) {
      res.status(400).send("Invalid job id.");
      return;
    }

    const job = await getJobById(jobId);
    if (!job) {
      res.status(404).send("Job not found.");
      return;
    }

    const applications = await getApplicationsByJobId(jobId);
    const rows = [
      [
        "application_id",
        "candidate_id",
        "candidate_name",
        "candidate_email",
        "candidate_phone",
        "ai_score",
        "ai_summary",
        "created_at",
      ],
      ...applications.map((application) => [
        application.id,
        application.candidate_id,
        application.candidate_name,
        application.candidate_email,
        application.candidate_phone,
        application.ai_score,
        application.ai_summary,
        application.created_at,
      ]),
    ];

    const csv = rowsToCsv(rows);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="job-${jobId}-applications.csv"`
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
