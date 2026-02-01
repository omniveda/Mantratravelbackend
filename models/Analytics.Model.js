const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            required: true,
            trim: true,
        },
        visitorId: {
            type: String, // Can be a session ID or hashed IP
            required: true,
        },
        device: String,
        browser: String,
        country: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index for faster queries on date and page
AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ page: 1 });

module.exports = mongoose.model("Analytics", AnalyticsSchema);
