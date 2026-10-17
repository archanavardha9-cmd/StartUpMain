const express = require("express");
const { rateLimit } = require("express-rate-limit");

const {
  getSectionContent,
  updateSectionContent,
  getCmsImage,
  uploadCmsImage,
} = require("../controllers/cmsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const imageUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many image uploads. Please try again later.",
  },
});

router.get("/test", (req, res) => {
  res.json({ message: "CMS route working" });
});

router.post(
  "/images",
  authMiddleware,
  imageUploadLimiter,
  express.raw({
    type: ["image/jpeg", "image/png", "image/webp"],
    limit: "8mb",
  }),
  uploadCmsImage
);

router.get("/images/:imageId", getCmsImage);

router.get("/:section", getSectionContent);

router.put("/:section", authMiddleware, updateSectionContent);

module.exports = router;