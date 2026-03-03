const OpenAI = require("openai");

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function buildSummary(result) {
  const strengths = Array.isArray(result.strengths)
    ? result.strengths.join("; ")
    : String(result.strengths || "");
  const risks = Array.isArray(result.risks)
    ? result.risks.join("; ")
    : String(result.risks || "");

  return [
    `Summary: ${String(result.summary || "").trim()}`,
    `Strengths: ${strengths}`,
    `Risks: ${risks}`,
  ].join("\n");
}

async function scoreCandidateForJob({ jobDescription, resumeText }) {
  if (!client) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const prompt = [
    "You are evaluating candidate-job fit for a quantitative finance role.",
    "Return strict JSON with keys: score, summary, strengths, risks.",
    "score must be an integer 0 to 100.",
    "summary must be 2-4 lines.",
    "strengths and risks must be short arrays.",
    "",
    "JOB DESCRIPTION:",
    jobDescription,
    "",
    "RESUME TEXT:",
    resumeText.slice(0, 12000),
  ].join("\n");

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Assess candidate-role fit for technical quantitative hiring. Stay factual and concise.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);
  const rawScore = Number(parsed.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : null;
  const summary = buildSummary(parsed);

  return {
    score,
    summary,
  };
}

module.exports = {
  scoreCandidateForJob,
};

