function escapeCsv(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

module.exports = {
  rowsToCsv,
};

