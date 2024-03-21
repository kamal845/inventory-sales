const express = require("express");
const router=express.Router();
const inventoryController = require("../controller/inventoryController");
router.post("/create", inventoryController.createInventory);
router.get("/get", inventoryController.getInventory);
router.put("/update/:id", inventoryController.updateInventory);
router.delete("/delete/:id", inventoryController.deleteInventory);

//for sales
// const { sellInventoryItem } = require('../controllers/inventoryController');

router.post('/:id/sell',inventoryController.sellInventoryItem);


module.exports = router;
