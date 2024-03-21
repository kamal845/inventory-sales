const express = require('express');
const Bill = require("../model/billSchema");
const InventoryItem = require("../model/inventorySchema");
const salesItem = require("../model/salesSchema"); 
const mongoose= require("mongoose");
module.exports = {
    getAllBills: async (req, res) => {
        try {
            const bills = await Bill.find();
            res.json({ bills });
        } catch (error) {
            res.status(500).json({
                statuscode: 500,
                status: "error",
                message: "Failed to retrieve bills",
                data: null
            });
        }
    },

    getBillDetails: async (req, res) => {
        try {
            const billId = req.params.billId;
            const bill = await Bill.findById(billId);
            if (!bill) {
                return res.status(404).json({
                    statuscode: 404,
                    status: "error",
                    message: "Bill not found",
                    data: null
                });
            }
            res.json({ bill });
        } catch (error) {
            res.status(500).json({
                statuscode: 500,
                status: "error",
                message: "Failed to retrieve bill details",
                data: null
            });
        }
    },
    createBill: async (req, res) => {
        try {
            const { items, totalAmount } = req.body;
            const bill = new Bill({
                items,
                totalAmount
            });
            await bill.save();
            console.log('Items:', items);
            console.log('Type of items:', typeof items);
            if (items && typeof items[Symbol.iterator] === 'function') {
                // Iterate over items
                for (const item of items) {
                    console.log(item);
                    await InventoryItem.findByIdAndUpdate(item.itemId, { $inc: { quantity: -item.quantity } });
                    const updatedItem = await InventoryItem.findById(item.itemId);
                    if (updatedItem.quantity === 0) {
                        await InventoryItem.findByIdAndDelete(item.itemId);
                    }
                }
            } else {
                console.error('Items is not defined or not iterable');
            }
            console.log('Type of items:', typeof items);
    
            const getItemDetails = async (itemId) => {
                const item = await InventoryItem.findById(itemId);
                return item;
            };
    
            // const itemDetailsPromises = items.map(async (item) => {
            //     const itemDetails = await getItemDetails(item.itemId);
            //     return { itemId: item.itemId, quantity: item.quantity, totalAmount: itemDetails.price * item.quantity, details: itemDetails }; // Merge item details with the sold item
            // });
    
            // const itemsWithDetails = await Promise.all(itemDetailsPromises);
    
            res.status(201).json({
                message: "Bill created successfully",
                billId: bill._id,
                // items: itemsWithDetails
            });
        } catch (error) {
            console.log(error, "error");
            res.status(500).json({
                statuscode: 500,
                status: "error",
                message: "Failed to create bill",
            });
        }
    }
    
    
};
