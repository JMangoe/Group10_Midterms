//[BOOK-06] Setup routes: POST /api/books, PUT /api/books/:id, DELETE /api/books/ id, GET /api/books.
//[BOOK-07] Restrict book creation/deletion routes so only admin users can perform them.

const express = require('express');
const router = express.Router();

const { createBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/bookController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, isAdmin, createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', authenticateToken, isAdmin, deleteBook);

module.exports = router; 