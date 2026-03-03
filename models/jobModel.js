const { all, get, run } = require("./database");

async function getAllJobs() {
  return all(
    `SELECT id, title, company, location, description, created_at
     FROM jobs
     ORDER BY created_at DESC, id DESC`
  );
}

async function getJobById(id) {
  return get(
    `SELECT id, title, company, location, description, created_at
     FROM jobs
     WHERE id = ?`,
    [id]
  );
}

async function createJob({ title, company, location, description }) {
  return run(
    `INSERT INTO jobs (title, company, location, description)
     VALUES (?, ?, ?, ?)`,
    [title, company, location, description]
  );
}

async function seedDefaultJobs() {
  const countRow = await get("SELECT COUNT(*) AS count FROM jobs");
  if (countRow.count > 0) {
    return;
  }

  const jobs = [
    {
      title: "Quantitative Analyst - Market Risk",
      company: "Northbridge Capital",
      location: "Mumbai, India",
      description:
        "Support market risk modeling for rates and FX portfolios, including stress testing, scenario analysis, and clear communication of quantitative outputs to risk committees.",
    },
    {
      title: "Model Risk Analyst",
      company: "Meridian Bank",
      location: "Bengaluru, India",
      description:
        "Review valuation and risk models used across trading and treasury functions. Responsibilities include challenge testing, documentation review, and remediation tracking.",
    },
    {
      title: "Quant Developer - Python",
      company: "Arcstone Investments",
      location: "Pune, India",
      description:
        "Build robust Python components for pricing, risk, and analytics workflows. Partner with quantitative researchers and platform engineers to improve reliability and speed.",
    },
    {
      title: "Derivatives Pricing Analyst",
      company: "Harbour Point Securities",
      location: "Hyderabad, India",
      description:
        "Contribute to pricing infrastructure for derivatives products, including calibration monitoring, valuation checks, and controls for model governance.",
    },
    {
      title: "Algorithmic Trading Developer",
      company: "Velocity Quant Labs",
      location: "Gurugram, India",
      description:
        "Develop strategy tooling and execution support systems for automated trading. Focus on clean implementation, observability, and resilient production behavior.",
    },
    {
      title: "Data Scientist - Financial Analytics",
      company: "Crestline Analytics",
      location: "Remote",
      description:
        "Design analytics models for portfolio insights and reporting. Translate statistical findings into usable decision support for financial teams.",
    },
  ];

  for (const job of jobs) {
    await createJob(job);
  }
}

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  seedDefaultJobs,
};

