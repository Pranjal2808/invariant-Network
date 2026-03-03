const express = require("express");
const { getAllJobs, getJobById } = require("../models/jobModel");

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

    res.render("job-detail", { job });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
