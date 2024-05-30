const express = require('express');
const { addTransaction } = require('../controllers/transactionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, addTransaction);

module.exports = router;
