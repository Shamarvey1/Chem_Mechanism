const express = require('express');
const { analyzeReactionHandler } = require('../controllers/reactionController');

const router = express.Router();

router.post('/analyze', analyzeReactionHandler);

module.exports = router;
