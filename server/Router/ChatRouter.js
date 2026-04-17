const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controller/ChatController');

router.post('/chat', sendMessage);

module.exports = router;
