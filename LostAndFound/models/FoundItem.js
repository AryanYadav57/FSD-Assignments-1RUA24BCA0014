const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  foundLocation: { type: String, required: true, trim: true, maxlength: 160 },
  dateFound: { type: Date, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Available', 'Returned'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);
