const CategoryConfig = require("../models/CategoryConfig.Model");

exports.getAllConfigs = async (req, res) => {
    try {
        const configs = await CategoryConfig.find();
        res.status(200).json(configs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConfigByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const config = await CategoryConfig.findOne({ categoryName });
        if (!config) {
            return res.status(404).json({ message: "Config not found" });
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const { categoryName, subtitle, subCategories } = req.body;
        const config = await CategoryConfig.findOneAndUpdate(
            { categoryName },
            { subtitle, subCategories },
            { new: true, upsert: true }
        );
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteConfig = async (req, res) => {
    try {
        const { categoryName } = req.params;
        await CategoryConfig.findOneAndDelete({ categoryName });
        res.status(200).json({ message: "Config deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.bulkUpdateConfigs = async (req, res) => {
    try {
        const { configs } = req.body; // Expecting an object where keys are categoryNames
        const operations = Object.entries(configs).map(([categoryName, data]) => ({
            updateOne: {
                filter: { categoryName },
                update: { subtitle: data.subtitle, subCategories: data.subs || data.subCategories },
                upsert: true
            }
        }));
        await CategoryConfig.bulkWrite(operations);
        res.status(200).json({ message: "Configs updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
