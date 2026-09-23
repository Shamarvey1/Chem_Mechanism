const { analyzeReaction } = require('../services/reactionService');

const analyzeReactionHandler = (req, res, next) => {
  try {
    const { reaction } = req.body;

    if (!reaction || !reaction.trim()) {
      return res.status(400).json({
        success: false,
        message: '"reaction" field is required and must not be empty.',
      });
    }

    const result = analyzeReaction(reaction.trim());

    return res.status(200).json({
      success: true,
      reaction: result.reaction,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { analyzeReactionHandler };
