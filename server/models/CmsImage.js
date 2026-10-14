const mongoose = require("mongoose");

const cmsImageSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp"],
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CmsImage", cmsImageSchema);
