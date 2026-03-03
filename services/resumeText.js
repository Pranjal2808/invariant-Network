const fs = require("fs/promises");
const path = require("path");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

async function extractResumeText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const parsed = await pdfParse(buffer);
    return String(parsed.text || "").trim();
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return String(result.value || "").trim();
  }

  const buffer = await fs.readFile(filePath);
  return buffer.toString("utf8").trim();
}

module.exports = {
  extractResumeText,
};

