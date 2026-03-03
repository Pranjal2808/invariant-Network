const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(501).send("Admin module will be added in Step 6.");
});

module.exports = router;

