const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  }],
  price: {
    type: Number,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
