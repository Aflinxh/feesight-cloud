const express = require('express');
const { updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/', authenticateToken, updateUser);
router.delete('/', authenticateToken, deleteUser); // Add this line

module.exports = router;
