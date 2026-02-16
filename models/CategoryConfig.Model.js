const mongoose = require("mongoose");

const CategoryConfigSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        default: ""
    },
    subCategories: [
        { type: String }
    ]
}, { timestamps: true });

module.exports = mongoose.model("CategoryConfig", CategoryConfigSchema);
