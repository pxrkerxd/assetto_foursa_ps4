const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// 1. Updated imports to match your folder and Shridhar's exports
const { analyzeSentiment } = require("../ai_integrations/sentiment");
const { validateReview } = require("../ai_integrations/validation");
const { checkAnomalies } = require("../ai_integrations/anomaly");
const { generateReply } = require("../ai_integrations/responseGenerator");
const moodPrediction = require("../ai_integrations/prediction");

// --- DASHBOARD DATA ROUTE (For Siddhesh's Real-time Gauge) ---
router.get("/dashboard-data", async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const recentReviews = await Review.find().sort({ createdAt: -1 }).limit(5);

    // Calculate real-time averages using MongoDB Aggregation
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgSentiment: { $avg: "$sentimentScore" },
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    res.json({
      totalReviews,
      recentReviews,
      // Sending 0 as a fallback if no reviews exist yet
      avgSentiment: stats.length > 0 ? Math.round(stats[0].avgSentiment) : 0, 
      avgRating: stats.length > 0 ? stats[0].avgRating : 0
    });
  } catch (error) {
    console.error("❌ Dashboard Data Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard intelligence." });
  }
});

// --- PROCESS REVIEW ROUTE (For Sahilkumar's Form) ---
router.post("/process", async (req, res) => {
  try {
    const { customerName, reviewText, rating } = req.body;

    // --- LAYER 1: VALIDATION ---
    const isValid = validateReview(reviewText);
    const isAnomaly = checkAnomalies(reviewText);

    if (!isValid || isAnomaly) {
      return res.status(400).json({ error: "Spam or anomaly detected." });
    }

    // --- LAYER 2: INTELLIGENCE ---
    const sentiment = analyzeSentiment(reviewText);

    // --- LAYER 3: ACTIONABLE RESPONSE ---
    const reply = generateReply(sentiment.score);

    // --- LAYER 4: STORAGE ---
    const newReview = new Review({
      customerName,
      reviewText,
      rating: rating || 5,
      sentimentScore: sentiment.score,
      category: sentiment.category || "General",
      aiReply: reply,
      isAnomaly: isAnomaly
    });

    await newReview.save();
    res.status(201).json(newReview);

  } catch (error) {
    console.error("❌ Processing Error:", error);
    res.status(500).json({ error: "Backend analysis failed. Check database connection." });
  }
});

module.exports = router;