const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

router.get('/', async (req, res) => {
  let b = await Budget.findOne();
  if (!b) b = await Budget.create({ selections: [], total: 0 });
  res.json(b);
});

router.post('/', async (req, res) => {
  const { room, design, cost } = req.body;
  let b = await Budget.findOne();
  if (!b) b = new Budget({ selections: [], total: 0 });
  b.selections.push({ room, design, cost });
  b.total += cost;
  await b.save();
  res.json(b);
});

module.exports = router;
