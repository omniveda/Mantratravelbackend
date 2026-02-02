const Instagram = require("../models/Instagram.Model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get all Instagram accounts
exports.getAllInstagrams = async (req, res) => {
    try {
        const { country, fallback } = req.query;
        let query = {};
        if (country) {
            query.country = country;
        }

        let instagrams = await Instagram.find(query).sort({ createdAt: -1 });

        // Fallback logic
        if (instagrams.length === 0 && country && fallback && country !== fallback) {
            query.country = fallback;
            instagrams = await Instagram.find(query).sort({ createdAt: -1 });
        }

        res.json(instagrams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Instagram accounts by all tags
exports.getAllInstagramsByTags = async (req, res) => {
    try {
        const { tags } = req.query;
        let query = {};
        if (tags) {
            query.tags = { $all: tags.split(",") };
        }

        let instagrams = await Instagram.find(query).sort({ createdAt: -1 });
        res.json(instagrams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Instagram account
exports.createInstagram = async (req, res) => {
    try {
        const { name, country, link } = req.body;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "Image is required" });
        }

        const uploadDetails = await uploadImageToCloudinary(
            req.files.image,
            process.env.FOLDER_NAME || "mantra-instagram"
        );

        const instagram = new Instagram({
            name,
            country,
            link,
            image: uploadDetails.secure_url,
        });

        const savedInstagram = await instagram.save();
        res.status(201).json(savedInstagram);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Update Instagram account
exports.updateInstagram = async (req, res) => {
    try {
        const { name, country, link } = req.body;
        let updateData = { name, country, link };

        if (req.files && req.files.image) {
            const uploadDetails = await uploadImageToCloudinary(
                req.files.image,
                process.env.FOLDER_NAME || "mantra-instagram"
            );
            updateData.image = uploadDetails.secure_url;
        }

        const instagram = await Instagram.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        if (!instagram) {
            return res.status(404).json({ message: "Instagram account not found" });
        }
        res.json(instagram);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

// Delete Instagram account
exports.deleteInstagram = async (req, res) => {
    try {
        const instagram = await Instagram.findByIdAndDelete(req.params.id);
        if (!instagram) {
            return res.status(404).json({ message: "Instagram account not found" });
        }
        res.json({ message: "Instagram account removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
