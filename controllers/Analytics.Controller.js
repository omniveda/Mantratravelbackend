const Analytics = require("../models/Analytics.Model");

// Track a new visit
exports.trackVisit = async (req, res) => {
    try {
        const { page, visitorId, device, browser, country } = req.body;

        if (!page || !visitorId) {
            return res.status(400).json({ message: "Page and VisitorId are required" });
        }

        const newVisit = new Analytics({
            page,
            visitorId,
            device,
            browser,
            country
        });

        await newVisit.save();
        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Tracking error:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get analytics stats for the dashboard
exports.getAnalyticsStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Total visits in last 30 days
        const totalVisits = await Analytics.countDocuments({
            timestamp: { $gte: thirtyDaysAgo }
        });

        // 2. Unique visitors in last 30 days
        const uniqueVisitors = await Analytics.distinct("visitorId", {
            timestamp: { $gte: thirtyDaysAgo }
        });

        // 3. Page views breakdown
        const pageViews = await Analytics.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: { _id: "$page", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 4. Daily visits for chart
        const dailyVisits = await Analytics.aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    visits: { $sum: 1 },
                    unique: { $addToSet: "$visitorId" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: "$_id",
                    visits: 1,
                    unique: { $size: "$unique" }
                }
            }
        ]);

        res.json({
            totalVisits,
            uniqueVisitors: uniqueVisitors.length,
            pageViews,
            dailyVisits
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ message: err.message });
    }
};
