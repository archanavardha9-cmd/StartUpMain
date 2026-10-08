import CmsContent from "../models/CmsContent.js";

export const getSectionContent = async (req, res) => {
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

export const updateSectionContent = async (req, res) => {
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