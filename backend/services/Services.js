//[BOOK-03] Implement service to create a book.

const Book = require('../model/Model');

module.exports.createBook = async (book) => {
    try {
        const newBook = new Book(book);
        await newBook.save();
        return {
            success: true,
            message: 'Book created successfully',
            data: newBook
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create book',
            error: error.message
        };
    }
};
