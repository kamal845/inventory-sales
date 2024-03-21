const express = require('express');
const inventoryItem=require("../model/inventorySchema");
const salesItem=require("../model/salesSchema");
// const { ObjectId } = require('mongoose').Types;
const mongoose=require('mongoose');
module.exports={
    createInventory: async (req, res) => {
        try {
            const { name, description, price, quantity } = req.body;
            const newItem = new inventoryItem({
                name,
                description,
                price,
                quantity
            });
            const savedItem = await newItem.save(); 
            if (!savedItem) {
                return res.status(500).json({ statuscode: 500, 
                    status: "false",
                     data: "Internal server error" });
            }
             return res.status(201).json({ statuscode: 201, 
                status: true,
                 message: "Data inventory created successfully", 
                 data: savedItem });
        } catch (error) {
            console.log(error,"error");
            return res.status(500).json
            ({ statuscode: 500, 
                status: "false", 
                data: "Internal server error" 
            });
        }
    },    

    getInventory: async (req, res) => {
        try {
            const items = await inventoryItem.find();
            if (items.length === 0) {
                return res.status(404).json({ error: "No inventory items found" });
            }
            res.json({
                statuscode: 200,
                status: "success",
                data: items,
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch inventory items" });
        }
    },
   
    updateInventory: async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const { ...body } = req.body;
                const id = new ObjectId(req.params.id);
                const updatedItem = await inventoryItem.findByIdAndUpdate({ _id: id }, {
                    $set: body
                });
    
                if (updatedItem) {
                    return res.json({
                      statuscode: 200,
                      status: "success",
                      message: "Item Updated Successfully!!",
                      data:updatedItem
                    });
                } else {
                  return res.json({
                    statuscode: 404,
                    status: "error",
                    data: "Not found",
                  });
                }
    
            } else {
              return res.json({
                statuscode: 404,
                status: "error",
                data: "Not found",
              });
            }
    
        } catch (error) {
            console.error("Error:", error);
            if (error.name === "ValidationError" || error.name === "CastError") {
              return res.json({
                statuscode: 404,
                status: "error",
                data: "Not found",
              });
            } else {
              return res.json({
                statuscode: 500,
                status: "error",
                data: "Not found",
              });
            }
        }
    },      

    deleteInventory: async (req, res) => {
        try {
            if (mongoose.Types.ObjectId.isValid(req.params.id)) {
                const id = new mongoose.Types.ObjectId(req.params.id);
                const deletedItem = await inventoryItem.findByIdAndDelete(id);
    
                if (deletedItem) {
                    return res.json({
                        statuscode: 200,
                        status: "success",
                        message: "Inventory item deleted successfully",
                        data: deletedItem
                    });
                } else {
                    return res.status(404).json({
                        statuscode: 404,
                        status: "error",
                        message: "Inventory item not found",
                        data: null
                    });
                }
            } else {
                return res.status(404).json({
                    statuscode: 404,
                    status: "error",
                    message: "Invalid ID",
                    data: null
                });
            }
        } catch (error) {
            console.log(error);
            if (error.name === "ValidationError" || error.name === "CastError") {
                return res.status(400).json({
                    statuscode: 400,
                    status: "error",
                    message: "Invalid data provided",
                    data: null
                });
            } else {
                return res.status(500).json({
                    statuscode: 500,
                    status: "error",
                    message: "Internal server error",
                    data: null
                });
            }
        }
    },
    sellInventoryItem: async (req, res) => {
        try { 
            const inventoryItemId = req.params.id;
            // Retrieve the inventory item from the database using its ID
            let inventoryItemFound = await inventoryItem.findById(inventoryItemId);
            if (!inventoryItemFound) {
                return res.status(404).json({ error: "Inventory item not found" });
            }
            
            // Create a new entry in the sales schema with the details of the sold item
            const soldItem = new salesItem({
                name: inventoryItemFound.name,
                description: inventoryItemFound.description,
                price: inventoryItemFound.price,
                quantity: inventoryItemFound.quantity
            });
            
            // Add the sold item to the itemsSold array
            soldItem.itemsSold.push({
                itemId: inventoryItemFound._id,
                name: inventoryItemFound.name,
                description: inventoryItemFound.description,
                price: inventoryItemFound.price,
                quantity: inventoryItemFound.quantity
            });
            
            // Save the sold item to the sales schema
            const savedSoldItem = await soldItem.save();
    
            // Remove the inventory item from the inventory schema
            await inventoryItem.findByIdAndDelete(inventoryItemId);
    
            return res.status(200).json({ message: "Inventory item sold successfully",  data: savedSoldItem });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};