const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // Required for Socket.io
const { Server } = require("socket.io"); // Required for WebSockets
require("dotenv").config();

const reviewRoutes = require("./routes/reviewRoutes");
const Review = require('./models/Review'); // Moved import to the top

const app = express();

// 1. Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow Next.js frontend to connect
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    // Add these two lines to instantly wipe the old data
    await Review.deleteMany({}); 
    console.log("🗑️ Old database data wiped clean!");
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 2. WebSocket Connection Listener
io.on('connection', (socket) => {
  console.log('⚡ Frontend connected via WebSocket');
  
  socket.on('disconnect', () => {
    console.log('Frontend disconnected');
  });
});

// Route Linkage
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Ready", platform: "Review Intelligence System" });
});

// ==========================================
// ✨ AI LOGIC GENERATOR
// ==========================================
function generateAIVerdict(avgRating, totalReviews) {
  if (totalReviews === 0) {
    return "Awaiting customer data to generate insights.";
  }
  if (avgRating >= 4.5) {
    return "Outstanding performance. Customers are highly praising the quality and service. Maintain current operational standards.";
  } else if (avgRating >= 3.5) {
    return "Overall positive sentiment, but mixed feedback detected. Customers appreciate the core service but highlight minor inconsistencies.";
  } else if (avgRating >= 2.5) {
    return "Warning: Customer satisfaction is dropping. Immediate review of service bottlenecks and food quality required.";
  } else {
    return "🚨 CRITICAL ALERT: Severe negative sentiment trend detected. Immediate management intervention required.";
  }
}

// ==========================================
// 📊 DASHBOARD ROUTES
// ==========================================

// GET Route: Fetch Initial Dashboard Data + AI Verdict
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);
    const totalReviews = await Review.countDocuments();
    
    // Calculate the real average rating using MongoDB Aggregation
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" }
        }
      }
    ]);

    // Check for anomalies (e.g., reviews flagged as spam)
    const anomalyCount = await Review.countDocuments({ isAnomaly: true });

    // Extract the math securely
    const calculatedAvgRating = stats.length > 0 ? (stats[0].avgRating || 0) : 0;
    
    // Convert a 5-star rating into a 100-point sentiment score for the Gauge
    const calculatedAvgSentiment = Math.round((calculatedAvgRating / 5) * 100);

    // Feed the math into the AI generator
    const aiVerdict = generateAIVerdict(calculatedAvgRating, totalReviews);
    
    res.json({
        totalReviews,
        recentReviews: reviews,
        avgRating: calculatedAvgRating,
        avgSentiment: calculatedAvgSentiment,
        anomalyCount: anomalyCount || 0,
        isDownTrend: calculatedAvgRating < 3.5 && totalReviews > 0, // Triggers the red warning box
        aiSummary: aiVerdict // Sends the sentence to the frontend
    });
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET Route: Fetch Branch Leaderboard Data
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Group reviews by branch, count them, and average their rating
    const leaderboard = await Review.aggregate([
      {
        $group: {
          _id: "$branch",
          reviews: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      { $sort: { avgRating: -1, reviews: -1 } } // Sort by highest rating, then most reviews
    ]);

    const formattedLeaderboard = leaderboard.map((branch, index) => {
      // Convert 5-star rating to a 100-point score
      const score = Math.round(((branch.avgRating || 0) / 5) * 100);
      
      return {
        rank: index + 1,
        name: branch._id || "General",
        city: "India", // Fallback city
        score: score,
        reviews: branch.reviews,
        trend: score >= 80 ? "up" : score >= 50 ? "stable" : "down",
        change: (Math.random() * 5).toFixed(1), // Slight randomization for demo trend visual
      };
    });

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET Route: Fetch NLP Tags
app.get('/api/tags', async (req, res) => {
  try {
    const reviews = await Review.find();
    
    // 1. Define our target keywords to look for
    const keywordStats = {
      "Food Quality": { count: 0, ratingSum: 0 },
      "Wait Time": { count: 0, ratingSum: 0 },
      "Ambience": { count: 0, ratingSum: 0 },
      "Staff": { count: 0, ratingSum: 0 },
      "Price": { count: 0, ratingSum: 0 },
      "Hygiene": { count: 0, ratingSum: 0 },
      "Delivery": { count: 0, ratingSum: 0 },
      "Portions": { count: 0, ratingSum: 0 },
      "Taste": { count: 0, ratingSum: 0 },
      "Service": { count: 0, ratingSum: 0 }
    };

    // 2. Scan every review in the database
    reviews.forEach(review => {
      const text = (review.text || review.content || "").toLowerCase();
      const rating = review.rating || 3;
      
      Object.keys(keywordStats).forEach(kw => {
        // If the review mentions this keyword
        if (text.includes(kw.toLowerCase()) || text.includes(kw.split(' ')[0].toLowerCase())) {
          keywordStats[kw].count++;
          keywordStats[kw].ratingSum += rating;
        }
      });
    });

    // 3. Format the data for the frontend Tag Cloud
    const tags = Object.keys(keywordStats)
      .filter(kw => keywordStats[kw].count > 0) // Only send tags that were actually mentioned
      .map(kw => {
        const avgRating = keywordStats[kw].ratingSum / keywordStats[kw].count;
        
        // Determine sentiment based on average star rating for this specific topic
        let sentiment = "neutral";
        if (avgRating >= 4) sentiment = "positive";
        if (avgRating <= 2.5) sentiment = "negative";
        
        return {
          label: `#${kw.replace(/\s+/g, '')}`, // Removes spaces (e.g. "Wait Time" -> "#WaitTime")
          // Multiply frequency by 5 just to make the UI look bigger/fuller for the demo!
          frequency: keywordStats[kw].count * 5, 
          sentiment: sentiment
        };
      });

    // Fallback if the database is empty or no keywords matched
    if (tags.length === 0) {
       return res.json([
         { label: "#NoDataYet", frequency: 50, sentiment: "neutral" }
       ]);
    }

    res.json(tags);
  } catch (error) {
    console.error("Tags Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ==========================================
// 📥 INGESTION ROUTES
// ==========================================

// 3. POST Route: Path 1 - Direct QR Scan Form
app.post('/api/reviews/direct', async (req, res) => {
  try {
    const { author, platform, rating, text, branch, isAnomaly } = req.body;
    
    const newReview = await Review.create({
      author: author || "Anonymous",
      platform: platform || "Direct",
      rating: rating,
      text: text,
      branch: branch || "General",
      isAnomaly: isAnomaly || false,
      createdAt: new Date()
    });

    // Broadcast the new review to the frontend instantly
    io.emit('new_review', newReview);

    res.status(201).json({ success: true, message: "Review added!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 4. POST Route: Path 2 - Aggregator Webhook (Zomato/Google)
app.post('/api/reviews/webhook', async (req, res) => {
  try {
    const { author, platform, rating, text, branch } = req.body;

    const newReview = await Review.create({
      author,
      platform, 
      rating,
      text,
      branch,
      createdAt: new Date()
    });

    // Broadcast this one too!
    io.emit('new_review', newReview);

    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Webhook processing failed");
  }
});

// 5. Start the Server (using server.listen instead of app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 AI Backend & WebSockets running on port ${PORT}`);
});