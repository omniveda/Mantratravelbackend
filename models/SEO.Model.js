const mongoose = require("mongoose");

const SEOSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            default: "Mantra Website"
        },
        description: {
            type: String,
            required: true,
            trim: true,
            default: "Welcome to Mantra - Your Travel Partner"
        },
        keywords: {
            type: String,
            required: true,
            trim: true,
            default: "travel, mantra, explore"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SEO", SEOSchema);
