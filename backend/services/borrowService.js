const BorrowRecord = require('../model/BorrowRecord');

// [BOR-03] Service to borrow a book - Developer 3
// Check availability, decrease copies
// [BOR-07] Prevent user from borrowing same book twice if not returned
const borrowBook = async (userId, bookId, Book) => {
  try {
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return {
        success: false,
        message: 'Book not found',
        statusCode: 404
      };
    }

    // [BOR-07] Check if user already has this book borrowed and not returned
    const existingBorrow = await BorrowRecord.findOne({
      userId: userId,
      bookId: bookId,
      status: 'borrowed'
    });

    if (existingBorrow) {
      return {
        success: false,
        message: 'You have already borrowed this book. Please return it before borrowing again.',
        statusCode: 400
      };
    }

    // [BOR-03] Check if book is available (has copies)
    if (book.availableCopies <= 0) {
      return {
        success: false,
        message: 'Book is not available. No copies left.',
        statusCode: 400
      };
    }

    // Create borrow record
    const borrowRecord = new BorrowRecord({
      userId: userId,
      bookId: bookId,
      borrowDate: new Date(),
      status: 'borrowed'
    });

    // [BOR-03] Decrease available copies
    book.availableCopies -= 1;

    // Save both records
    await borrowRecord.save();
    await book.save();

    return {
      success: true,
      message: 'Book borrowed successfully',
      data: borrowRecord,
      statusCode: 201
    };
  } catch (error) {
    console.error('Error in borrowBook service:', error);
    return {
      success: false,
      message: 'Error borrowing book',
      error: error.message,
      statusCode: 500
    };
  }
};

module.exports = {
  borrowBook
};
