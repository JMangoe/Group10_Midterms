//[BOOK-03] Implement service to create a book.

const Book = require('../model/bookModel');

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

//[BOOK-04] Implement service to update book details and available Copies.

const Book = require('../model/bookModel');

module.exports.updateBook = async (id, book) => {
    try {
        const updatedBook = await Book.findOneAndUpdate(
            { id: id }, 
            book, 
            { new: true, runValidators: true }
        );
        
        if (!updatedBook) {
            return {
                success: false,
                message: 'Book not found'
            };
        }
        
        return {
            success: true,
            message: 'Book updated successfully',
            data: updatedBook
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to update book',
            error: error.message
        };
    }
};
