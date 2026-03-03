const { get, run } = require("./database");

async function getCandidateByEmail(email) {
  return get(
    `SELECT id, name, email, phone, years_of_experience, skills, resume_path, created_at
     FROM candidates
     WHERE email = ?`,
    [email]
  );
}

async function getCandidateById(id) {
  return get(
    `SELECT id, name, email, phone, years_of_experience, skills, resume_path, created_at
     FROM candidates
     WHERE id = ?`,
    [id]
  );
}

async function createCandidate({
  name,
  email,
  phone,
  yearsOfExperience,
  skills,
  resumePath,
}) {
  return run(
    `INSERT INTO candidates (name, email, phone, years_of_experience, skills, resume_path)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, phone, yearsOfExperience, skills, resumePath]
  );
}

module.exports = {
  getCandidateByEmail,
  getCandidateById,
  createCandidate,
};

