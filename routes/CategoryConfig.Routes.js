const express = require("express");
const router = express.Router();
const {
    getAllConfigs,
    getConfigByCategory,
    updateConfig,
    deleteConfig,
    bulkUpdateConfigs
} = require("../controllers/CategoryConfig.Controller");

router.get("/", getAllConfigs);
router.get("/:categoryName", getConfigByCategory);
router.post("/", updateConfig);
router.post("/bulk", bulkUpdateConfigs);
router.delete("/:categoryName", deleteConfig);

module.exports = router;
