const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  lastSeenLocation: { type: String, required: true, trim: true, maxlength: 160 },
  dateLost: { type: Date, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Missing', 'Found'], default: 'Missing' }
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
