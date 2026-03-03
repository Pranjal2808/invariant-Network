const express = require("express");
const path = require("path");
const { getAllJobs, getJobById } = require("../models/jobModel");
const { getCandidateByEmail } = require("../models/candidateModel");
const {
  createApplication,
  updateApplicationAiResult,
} = require("../models/applicationModel");
const { extractResumeText } = require("../services/resumeText");
const { scoreCandidateForJob } = require("../services/openai");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const jobs = await getAllJobs();
    res.render("jobs", { jobs });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
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

    res.render("job-detail", {
      job,
      success: req.query.success || "",
      error: req.query.error || "",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/apply", async (req, res, next) => {
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

    const email = String(req.body.candidate_email || "").trim().toLowerCase();
    if (!email) {
      res.redirect(`/jobs/${jobId}?error=Candidate email is required to apply.`);
      return;
    }

    const candidate = await getCandidateByEmail(email);
    if (!candidate) {
      res.redirect(`/jobs/${jobId}?error=Please complete candidate registration first.`);
      return;
    }

    const createdApplication = await createApplication({
      candidateId: candidate.id,
      jobId,
    });

    try {
      const resumeAbsolutePath = path.join(__dirname, "..", candidate.resume_path);
      const resumeText = await extractResumeText(resumeAbsolutePath);
      const aiResult = await scoreCandidateForJob({
        jobDescription: job.description,
        resumeText,
      });

      if (aiResult) {
        await updateApplicationAiResult({
          applicationId: createdApplication.id,
          aiScore: aiResult.score,
          aiSummary: aiResult.summary,
        });
      }
    } catch (aiError) {
      console.error("AI evaluation error:", aiError);
    }

    res.redirect(`/jobs/${jobId}?success=Application submitted successfully.`);
  } catch (error) {
    if (error && error.code === "SQLITE_CONSTRAINT") {
      const jobId = Number(req.params.id);
      res.redirect(`/jobs/${jobId}?error=You have already applied for this job.`);
      return;
    }

    next(error);
  }
});

module.exports = router;
