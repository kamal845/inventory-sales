const express = require("express");
const router = express.Router();
const billController = require("../controller/billController");

// Routes for bills
router.get("/allbills", billController.getAllBills);
router.get("/:billId", billController.getBillDetails);
router.post("/createbill", billController.createBill);

module.exports = router;
