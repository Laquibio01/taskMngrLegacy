const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
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
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: ['CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED', 'TITLE_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNED']
  },
  oldValue: {
    type: String,
    default: ''
  },
  newValue: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
historySchema.index({ taskId: 1 });
historySchema.index({ userId: 1 });
historySchema.index({ createdAt: -1 });

module.exports = mongoose.model('History', historySchema);
