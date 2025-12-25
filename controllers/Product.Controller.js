const Product = require("../models/Product.Model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, affiliateLink } = req.body;
        let image = "";

        if (req.files && req.files.image) {
            const uploadDetails = await uploadImageToCloudinary(
                req.files.image,
                process.env.FOLDER_NAME || "mantra-products"
            );
            image = uploadDetails.secure_url;
        } else {
            return res.status(400).json({ message: "Image is required" });
        }

        const product = new Product({
            name,
            description,
            affiliateLink,
            image,
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, affiliateLink } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.affiliateLink = affiliateLink || product.affiliateLink;

        if (req.files && req.files.image) {
            const uploadDetails = await uploadImageToCloudinary(
                req.files.image,
                process.env.FOLDER_NAME || "mantra-products"
            );
            product.image = uploadDetails.secure_url;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Optionally delete from Cloudinary
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
