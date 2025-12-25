const express = require("express");
const router = express.Router();
const productController = require("../controllers/Product.Controller");
const auth = require("../middlewares/auth");

// Get all products (Public)
router.get("/", productController.getAllProducts);

// Create product (Admin only - protected)
router.post("/", auth, productController.createProduct);

// Update product (Admin only - protected)
router.put("/:id", auth, productController.updateProduct);

// Delete product (Admin only - protected)
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
