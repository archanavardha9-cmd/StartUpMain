const CmsContent = require("../models/CmsContent");

const getSectionContent = async (req, res) => {
  try {
    const { section } = req.params;

    const data = await CmsContent.findOne({ section });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateSectionContent = async (req, res) => {
  try {
    const { section } = req.params;

    const updated = await CmsContent.findOneAndUpdate(
      { section },
      {
        section,
        content: req.body,
      },
      {
        upsert: true,
        new: true,
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSectionContent,
  updateSectionContent,
};