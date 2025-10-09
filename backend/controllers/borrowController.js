const { borrowBook, returnBook } = require('../services/borrowService');

// [BOR-05] Controller for borrow action - Developer 3
const borrowBookController = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id; // Assuming user ID comes from auth middleware
    
    // Assuming Book model will be passed or imported
    // For now, we'll need to import it when Developer 2 creates it
    const Book = require('../model/Model').Book || require('../model/Book');
    
    const result = await borrowBook(userId, bookId, Book);
    
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data || null
    });
  } catch (error) {
    console.error('Error in borrowBookController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// [BOR-05] Controller for return action - Developer 3
const returnBookController = async (req, res) => {
  try {
    const { borrowRecordId } = req.body;
    
    // Assuming Book model will be passed or imported
    const Book = require('../model/Model').Book || require('../model/Book');
    
    const result = await returnBook(borrowRecordId, Book);
    
    return res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data || null
    });
  } catch (error) {
    console.error('Error in returnBookController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// [BOR-06] Controller to get user's borrow records - Developer 3
const getUserBorrowsController = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID comes from auth middleware
    const BorrowRecord = require('../model/BorrowRecord');
    
    const borrows = await BorrowRecord.find({ userId: userId })
      .populate('bookId', 'title author')
      .sort({ borrowDate: -1 });
    
    return res.status(200).json({
      success: true,
      message: 'Borrow records retrieved successfully',
      data: borrows
    });
  } catch (error) {
    console.error('Error in getUserBorrowsController:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  borrowBookController,
  returnBookController,
  getUserBorrowsController
};
