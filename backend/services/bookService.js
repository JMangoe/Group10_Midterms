//[BOOK-04] Implement service to update book details and available Copies.

const Book = require('../model/Model');

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
