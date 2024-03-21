const mongoose = require('mongoose');
const salesSchema = new mongoose.Schema({
  itemsSold: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true
    },
    name:{
      type: String,
    required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: false
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
