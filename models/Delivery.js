const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  time: { type: String, required: true },
  name: { type: String, required: true },
  company: { type: String, required: true },
  quantity: { type: Number, required: true },
  document: { type: String, required: true },
  userName: { type: String, required: true },
});

module.exports = mongoose.model('Delivery', DeliverySchema);

