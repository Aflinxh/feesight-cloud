const express = require('express');
const { updateUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/', authenticateToken, updateUser);

module.exports = router;
