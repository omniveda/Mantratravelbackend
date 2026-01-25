const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
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
    tags: [String],
    country: {
      type: String,
      default: "General",
    },
    category: {
      type: String,
      enum: ["Blog", "Destination"],
      default: "Blog",
    },
    section: {
      type: String,
      default: "General", // e.g., Explorer, States, Instagram, Hero, Testimonials
    },
    externalLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
