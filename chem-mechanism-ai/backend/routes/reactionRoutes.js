const express = require('express');
const { analyzeReactionHandler, getJeeQuestionsHandler } = require('../controllers/reactionController');
const router = express.Router();
router.post('/analyze', analyzeReactionHandler);
router.post('/jee-questions', getJeeQuestionsHandler);
module.exports = router;
