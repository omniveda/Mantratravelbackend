const express = require("express");
const router = express.Router();
const seoController = require("../controllers/SEO.Controller");
const auth = require("../middlewares/auth");

// Public route to get SEO settings
router.get("/", seoController.getSEO);

// Admin route to update SEO settings
router.put("/", auth, seoController.updateSEO);

module.exports = router;
