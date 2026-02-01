const express = require("express");
const router = express.Router();
const instagramController = require("../controllers/Instagram.Controller");
const auth = require("../middlewares/auth");

// Get all Instagram accounts (Public)
router.get("/", instagramController.getAllInstagrams);

// Create Instagram account (Admin only)
router.post("/", auth, instagramController.createInstagram);

// Update Instagram account (Admin only)
router.put("/:id", auth, instagramController.updateInstagram);

// Delete Instagram account (Admin only)
router.delete("/:id", auth, instagramController.deleteInstagram);

module.exports = router;
