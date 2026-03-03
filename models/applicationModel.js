const { all, get, run } = require("./database");

async function createApplication({ candidateId, jobId, aiScore = null, aiSummary = null }) {
  return run(
    `INSERT INTO applications (candidate_id, job_id, ai_score, ai_summary)
     VALUES (?, ?, ?, ?)`,
    [candidateId, jobId, aiScore, aiSummary]
  );
}

async function getApplicationsByJobId(jobId) {
  return all(
    `SELECT a.id, a.candidate_id, a.job_id, a.ai_score, a.ai_summary, a.created_at,
            c.name AS candidate_name, c.email AS candidate_email, c.phone AS candidate_phone
     FROM applications a
     INNER JOIN candidates c ON c.id = a.candidate_id
     WHERE a.job_id = ?
     ORDER BY a.created_at DESC, a.id DESC`,
    [jobId]
  );
}

async function getApplicationById(applicationId) {
  return get(
    `SELECT id, candidate_id, job_id, ai_score, ai_summary, created_at
     FROM applications
     WHERE id = ?`,
    [applicationId]
  );
}

async function updateApplicationAiResult({ applicationId, aiScore, aiSummary }) {
  return run(
    `UPDATE applications
     SET ai_score = ?, ai_summary = ?
     WHERE id = ?`,
    [aiScore, aiSummary, applicationId]
  );
}

module.exports = {
  createApplication,
  getApplicationsByJobId,
  getApplicationById,
  updateApplicationAiResult,
};

