const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/Analytics.Controller");
const auth = require("../middlewares/auth");

// Public route to track visit
router.post("/track", analyticsController.trackVisit);

// Admin route to get stats
router.get("/stats", auth, analyticsController.getAnalyticsStats);

module.exports = router;
