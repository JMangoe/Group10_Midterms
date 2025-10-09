//[BOOK-06] Setup routes: POST /api/books, PUT /api/books/:id, DELETE /api/books/ id, GET /api/books.

const express = require('express');
const router = express.Router();

const { createBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;