const express = require("express");

const {
  getSectionContent,
  updateSectionContent,
} = require("../controllers/cmsController");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "CMS route working" });
});

router.get("/:section", getSectionContent);

router.put("/:section", updateSectionContent);

module.exports = router;