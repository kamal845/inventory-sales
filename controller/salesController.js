const express = require('express');
const salesItem=require("../model/salesSchema");
const inventoryItem=require("../model/inventorySchema");
const Bill = require("../model/billSchema");
module.exports={
    getSoldItem: async (req, res) => {
        try {
            const sales = await salesItem.find();
            const soldItemIds = sales.flatMap(sale => sale.itemsSold.map(item => item.itemId));
           const soldItems = await inventoryItem.find({ _id: { $in: soldItemIds } });
           for (const soldItem of soldItems) {
                await inventoryItem.findByIdAndDelete(soldItem._id);
            }
            res.json({ soldItems });
        } catch (error) {
            return res.status(500).json({
                statuscode: 500,
                status: "error",
                message: "Internal server error",
                data: null
            });
        }
    },
    getUnsoldItem: async (req, res) => {
        try {
            const allItems = await inventoryItem.find();
            const sales = await salesItem.find();
            const soldItemIds = sales.flatMap(sale => sale.itemsSold.map(item => item.itemId));
            const unsoldItems = allItems.filter(item => !soldItemIds.includes(item._id));

            res.json({ unsoldItems });
        } catch (error) {
            return res.status(500).json({
                statuscode: 500,
                status: "error",
                message: "Internal server error",
                data: null
            });
        }
    },
    getAllSoldItems: async (req, res) => {
        try {
            const sales = await salesItem.find();
            const allSoldItems = [];
    
            for (const sale of sales) {
                for (const itemSold of sale.itemsSold) {
                    const itemDetails = await inventoryItem.findById(itemSold.itemId);
                    allSoldItems.push(itemDetails);
                    await inventoryItem.findByIdAndDelete(itemSold.itemId);
                }
            }
            res.json({ allSoldItems });
        } catch (error) {
            return res.status(500).json({
                statuscode: 500,
                status: "error",
                message: "Internal server error",
                data: null
            });
        }
    }
} 