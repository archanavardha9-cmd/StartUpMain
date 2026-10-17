
const CmsContent = require("../models/CmsContent");
const CmsImage = require("../models/CmsImage");
const CMS_SECTIONS = new Set([
  "header",
  "footer",
  "hero",
  "space-audience",
  "trust-result",
  "spaces-pricing",
  "location-cta",
  "site-settings",
]);

const IMAGE_SIGNATURES = {
  "image/jpeg": (data) =>
    data.length >= 3 &&
    data[0] === 0xff &&
    data[1] === 0xd8 &&
    data[2] === 0xff,
  "image/png": (data) =>
    data.length >= 8 &&
    data.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    ),
  "image/webp": (data) =>
    data.length >= 12 &&
    data.toString("ascii", 0, 4) === "RIFF" &&
    data.toString("ascii", 8, 12) === "WEBP",
};

const getSectionContent = async (req, res, next) => {
  try {
    const { section } = req.params;

    const data = await CmsContent.findOne({ section });

    if (!data) {
      return res.status(200).json({
        section,
        content: null,
        message: "Section content not found",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

const updateSectionContent = async (req, res, next) => {
  try {
    const { section } = req.params;

    if (!CMS_SECTIONS.has(section)) {
      return res.status(404).json({
        success: false,
        message: "CMS section not found.",
      });
    }

    // Accept either { content: {...} } or the content object directly.
    const content =
      req.body &&
      Object.prototype.hasOwnProperty.call(req.body, "content")
        ? req.body.content
        : req.body;

    const updated = await CmsContent.findOneAndUpdate(
      { section },
      {
        $set: {
          section,
          content,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

const uploadCmsImage = async (req, res, next) => {
  try {
    const contentType = req.get("Content-Type");
    const isValidImage =
      Buffer.isBuffer(req.body) &&
      IMAGE_SIGNATURES[contentType]?.(req.body);

    if (!isValidImage) {
      return res.status(400).json({
        message: "Upload a valid PNG, JPEG, or WEBP image.",
      });
    }

    const image = await CmsImage.create({
      contentType,
      data: req.body,
    });

    return res.status(201).json({
      url: `/api/cms/images/${image.id}`,
    });
  } catch (error) {
    return next(error);
  }
};

const getCmsImage = async (req, res, next) => {
  try {
    const image = await CmsImage.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    res.set("Content-Type", image.contentType);
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(image.data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSectionContent,
  updateSectionContent,
  getCmsImage,
  uploadCmsImage,
};
