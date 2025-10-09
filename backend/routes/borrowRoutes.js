const express = require('express');
const router = express.Router();
const { 
  borrowBookController, 
  returnBookController, 
  getUserBorrowsController 
} = require('../controllers/borrowController');
const { 
  validateBorrowRequest, 
  validateReturnRequest 
} = require('../validators/borrowValidator');
const { authenticate } = require('../middleware/authMiddleware');

// [BOR-06] Setup routes
router.post('/borrow', authenticate, validateBorrowRequest, borrowBookController);
router.post('/return', authenticate, validateReturnRequest, returnBookController);
router.get('/borrows', authenticate, getUserBorrowsController);

module.exports = router;
