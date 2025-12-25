const News = require("../models/News.Model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get all news
exports.getAllNews = async (req, res) => {
    try {
        const { category, tag } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        const news = await News.find(query).sort({ publishDate: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single news
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create news
exports.createNews = async (req, res) => {
    try {
        const { heading, subHeading, description, author, category, tags } = req.body;
        let image = "";

        if (req.files && req.files.image) {
            const uploadDetails = await uploadImageToCloudinary(
                req.files.image,
                process.env.FOLDER_NAME || "mantra-news"
            );
            image = uploadDetails.secure_url;
        }

        // tags might come as stringified array or simply string
        let parsedTags = tags;
        if (typeof tags === "string") {
            try {
                parsedTags = JSON.parse(tags);
            } catch (e) {
                parsedTags = tags.split(',').map(tag => tag.trim());
            }
        }

        const news = new News({
            heading,
            subHeading,
            description,
            author,
            image,
            category: category || "General",
            tags: parsedTags,
        });

        const savedNews = await news.save();
        res.status(201).json(savedNews);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Update news
exports.updateNews = async (req, res) => {
    try {
        const { heading, subHeading, description, author, category, tags } = req.body;
        let updateData = { heading, subHeading, description, author, category };

        if (tags) {
            let parsedTags = tags;
            if (typeof tags === "string") {
                try {
                    parsedTags = JSON.parse(tags);
                } catch (e) {
                    parsedTags = tags.split(',').map(tag => tag.trim());
                }
            }
            updateData.tags = parsedTags;
        }

        if (req.files && req.files.image) {
            const uploadDetails = await uploadImageToCloudinary(
                req.files.image,
                process.env.FOLDER_NAME || "mantra-news"
            );
            updateData.image = uploadDetails.secure_url;
        }

        const news = await News.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }
        res.json(news);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Delete news
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }
        // Optionally delete image from Cloudinary here
        res.json({ message: "News removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
