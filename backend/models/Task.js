const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Pendiente', 'En Progreso', 'Completada', 'Bloqueada', 'Cancelada'],
    default: 'Pendiente'
  },
  priority: {
    type: String,
    enum: ['Baja', 'Media', 'Alta', 'Crítica'],
    default: 'Media'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dueDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        return !value || value instanceof Date;
      },
      message: 'Due date must be a valid date'
    }
  },
  estimatedHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    default: 0
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Task', taskSchema);
