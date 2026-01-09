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
        const { heading, subHeading, description, author, category, tags, content, supporter_opinion, opponent_opinion, neutral_opinion } = req.body;

        let parsedContent = [];
        if (typeof content === "string") {
            try {
                parsedContent = JSON.parse(content);
            } catch (e) {
                parsedContent = [];
            }
        } else {
            parsedContent = content || [];
        }

        let images = [];

        // Handle images within content
        if (req.files) {
            for (let i = 0; i < parsedContent.length; i++) {
                const section = parsedContent[i];
                if (section.type === "image" && section.isNewFile) {
                    const fileKey = `image_${i}`;
                    if (req.files[fileKey]) {
                        const uploadDetails = await uploadImageToCloudinary(
                            req.files[fileKey],
                            process.env.FOLDER_NAME || "mantra-news"
                        );
                        section.value = uploadDetails.secure_url;
                        delete section.isNewFile;
                        images.push(uploadDetails.secure_url);
                    }
                } else if (section.type === "image" && typeof section.value === "string") {
                    images.push(section.value);
                }
            }
        }

        // tags parsing
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
            author,
            category: category || "General",
            tags: parsedTags,
            image: images[0] || "",
            images,
            content: parsedContent,
            supporter_opinion: supporter_opinion || "",
            opponent_opinion: opponent_opinion || "",
            neutral_opinion: neutral_opinion || "",
            // For backward compatibility
            description: description || parsedContent.find(c => c.type === "paragraph")?.value || "",
            paragraphs: parsedContent.filter(c => c.type === "paragraph").map(c => c.value),
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
        const { heading, subHeading, description, author, category, tags, content, supporter_opinion, opponent_opinion, neutral_opinion } = req.body;
        let updateData = { heading, subHeading, author, category, supporter_opinion, opponent_opinion, neutral_opinion };

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

        if (content) {
            let parsedContent = [];
            try {
                parsedContent = typeof content === "string" ? JSON.parse(content) : content;
            } catch (e) {
                parsedContent = [];
            }

            let images = [];
            // Process images in content
            for (let i = 0; i < parsedContent.length; i++) {
                const section = parsedContent[i];
                if (section.type === "image") {
                    if (section.isNewFile) {
                        const fileKey = `image_${i}`;
                        if (req.files && req.files[fileKey]) {
                            const uploadDetails = await uploadImageToCloudinary(
                                req.files[fileKey],
                                process.env.FOLDER_NAME || "mantra-news"
                            );
                            section.value = uploadDetails.secure_url;
                            delete section.isNewFile;
                        }
                    }
                    if (typeof section.value === "string" && section.value.startsWith("http")) {
                        images.push(section.value);
                    }
                }
            }

            updateData.content = parsedContent;
            updateData.images = images;
            updateData.image = images[0] || "";
            updateData.paragraphs = parsedContent.filter(c => c.type === "paragraph").map(c => c.value);
            updateData.description = description || updateData.paragraphs[0] || "";
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
