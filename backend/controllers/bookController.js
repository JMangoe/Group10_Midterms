//[BOOK-05] Implement controllers for book CRUD.

const { validateBook } = require('../validators/Validators');
const { updateBook: updateBookService } = require('../services/bookService');
const Book = require('../model/bookModel');

//create
module.exports.createBook = async (req, res) => {
    try {
        const errors = validateBook(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        
        const result = await createBookService(req.body);
        if (result.success) {
            return res.status(201).json(result);
        }
        return res.status(500).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//retrieve
module.exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({ id: req.params.id });
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//update
module.exports.updateBook = async (req, res) => {
    try {
        const errors = validateBook(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        
        const result = await updateBookService(req.params.id, req.body);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//delete
module.exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ id: req.params.id });
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
