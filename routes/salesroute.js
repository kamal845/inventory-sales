const express = require("express");
const router = express.Router();
const salesController = require("../controller/salesController");

// Routes for sales
router.get("/sold-items", salesController. getAllSoldItems);
router.get("/unsold-items", salesController.getUnsoldItem);

router.get("/sold-items/:id", salesController.getSoldItem);

module.exports = router;
