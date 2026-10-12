
const CmsContent = require("../models/CmsContent");

const getSectionContent = async (req, res) => {
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
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateSectionContent = async (req, res) => {
  try {
    const { section } = req.params;

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
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSectionContent,
  updateSectionContent,
};
