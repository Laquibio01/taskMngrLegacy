const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation rules
const commentValidation = [
  body('taskId').notEmpty().withMessage('Task ID is required'),
  body('commentText').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 })
];

router.get('/task/:taskId', authenticate, commentController.getCommentsByTask);
router.post('/', authenticate, commentValidation, commentController.createComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
