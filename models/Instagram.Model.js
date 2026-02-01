const mongoose = require("mongoose");

const InstagramSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        link: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Instagram", InstagramSchema);
