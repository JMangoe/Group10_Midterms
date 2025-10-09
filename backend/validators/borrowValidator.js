const mongoose = require('mongoose');

// [BOR-02] Validator for borrowing requests - Developer 3
const validateBorrowRequest = (req, res, next) => {
  const { bookId } = req.body;

  // Check if bookId is provided
  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: 'Book ID is required'
    });
  }

  // Check if bookId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Book ID format'
    });
  }

  next();
};

// Validator for return requests
const validateReturnRequest = (req, res, next) => {
  const { borrowRecordId } = req.body;

  // Check if borrowRecordId is provided
  if (!borrowRecordId) {
    return res.status(400).json({
      success: false,
      message: 'Borrow Record ID is required'
    });
  }

  // Check if borrowRecordId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(borrowRecordId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Borrow Record ID format'
    });
  }

  next();
};

module.exports = {
  validateBorrowRequest,
  validateReturnRequest
};
