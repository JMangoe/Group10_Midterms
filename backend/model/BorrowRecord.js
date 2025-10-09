const mongoose = require('mongoose');

// [BOR-01] BorrowRecord Model - Developer 3
const borrowRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned'],
    default: 'borrowed',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
borrowRecordSchema.index({ userId: 1, bookId: 1, status: 1 });

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

module.exports = BorrowRecord;
