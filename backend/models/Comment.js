const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  commentText: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ taskId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
