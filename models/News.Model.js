const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
            trim: true,
        },
        subHeading: {
            type: String,
            required: false, // Optional
            trim: true,
        },
        author: {
            type: String,
            required: true,
        },
        description: { // Keeping description to match Blog, can be content
            type: String,
            required: true,
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        image: {
            type: String,
            default: "",
        },
        images: [String],
        paragraphs: [String],
        content: [
            {
                type: { type: String },
                value: mongoose.Schema.Types.Mixed,
            },
        ],
        supporter_opinion: {
            type: String,
            default: "",
        },
        opponent_opinion: {
            type: String,
            default: "",
        },
        neutral_opinion: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            // Enum to strictly categorize news for the UI layout
            enum: ["Top Story", "Headline", "Trending", "General"],
            default: "General"
        },
        tags: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
