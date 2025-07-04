const mongoose = require('mongoose');

const selectionSchema = new mongoose.Schema({
  room: String,
  design: String,
  cost: Number,
});

const BudgetSchema = new mongoose.Schema({
  selections: [selectionSchema],
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Budget', BudgetSchema);
