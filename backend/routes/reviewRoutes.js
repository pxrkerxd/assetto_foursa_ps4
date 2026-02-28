const express = require("express");
const router = express.Router();
const Review = require("../models/review");

router.post("/review", async (req, res) => {
  try {
    const { name, branch, rating, category, comment } = req.body;

    const universalScore = rating * 20; // 5 stars → 100

    const newReview = new Review({
      name,
      branch,
      rating,
      category,
      comment,
      universalScore
    });

    await newReview.save();

    res.json({ message: "Review saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;