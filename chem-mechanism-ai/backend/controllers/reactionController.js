const { analyzeReaction } = require('../services/reactionService');
const { generateJeeQuestions } = require('../services/jeeQuestionGenerator');
const analyzeReactionHandler = async (req, res, next) => {
  try {
    const { reaction } = req.body;
    if (!reaction || !reaction.trim()) {
      return res.status(400).json({
        success: false,
        message: '"reaction" field is required and must not be empty.',
      });
    }
    const result = await analyzeReaction(reaction.trim());
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
const getJeeQuestionsHandler = async (req, res, next) => {
  try {
    const { reaction, reactionData } = req.body;
    if (!reaction || !reaction.trim()) {
      return res.status(400).json({
        success: false,
        message: '"reaction" field is required and must not be empty.',
      });
    }
    const questions = await generateJeeQuestions(reaction.trim(), reactionData);
    return res.status(200).json({
      success: true,
      data: { questions },
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { analyzeReactionHandler, getJeeQuestionsHandler };