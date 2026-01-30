const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['task_assigned', 'task_updated', 'task_completed', 'comment_added', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
