const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  name: String,
  branch: String,
  rating: Number,
  category: String,
  comment: String,
  sentiment: String,
  tags: [String],
  universalScore: Number,
  status: {
    type: String,
    default: "Open"
  }
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);