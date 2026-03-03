const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(501).send("Jobs module will be added in Step 3.");
});

module.exports = router;

