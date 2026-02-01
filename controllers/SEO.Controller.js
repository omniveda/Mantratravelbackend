const SEO = require("../models/SEO.Model");

// Get SEO settings
exports.getSEO = async (req, res) => {
    try {
        let seo = await SEO.findOne();
        if (!seo) {
            // Create default if not exists
            seo = await SEO.create({});
        }
        res.json(seo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update SEO settings
exports.updateSEO = async (req, res) => {
    try {
        const { title, description, keywords } = req.body;

        let seo = await SEO.findOne();
        if (seo) {
            seo.title = title || seo.title;
            seo.description = description || seo.description;
            seo.keywords = keywords || seo.keywords;
            await seo.save();
        } else {
            seo = await SEO.create({ title, description, keywords });
        }

        res.json(seo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
