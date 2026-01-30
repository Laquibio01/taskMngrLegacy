const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

// Get comments by task ID
exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ taskId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = new Comment({
      ...req.body,
      userId: req.userId
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error creating comment', error: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only allow deletion by comment owner
    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};
