import express from "express";

import {
  getSectionContent,
  updateSectionContent,
} from "../controllers/cmsController.js";

const router = express.Router();

router.get("/:section", getSectionContent);

router.put("/:section", updateSectionContent);

export default router;