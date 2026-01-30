const Task = require('../models/Task');
const History = require('../models/History');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
};

// Create task
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const taskData = {
      ...req.body,
      createdBy: req.userId
    };

    // Validate dueDate
    if (taskData.dueDate && isNaN(Date.parse(taskData.dueDate))) {
      return res.status(400).json({ message: 'Invalid due date format' });
    }

    if (taskData.dueDate) {
      taskData.dueDate = new Date(taskData.dueDate);
    }

    const task = new Task(taskData);
    await task.save();

    // Create history entry
    await History.create({
      taskId: task._id,
      userId: req.userId,
      action: 'CREATED',
      oldValue: '',
      newValue: task.title
    });

    // Create notification if assigned
    if (task.assignedTo && task.assignedTo.toString() !== req.userId) {
      await Notification.create({
        userId: task.assignedTo,
        message: `Nueva tarea asignada: ${task.title}`,
        type: 'task_assigned'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldTask = { ...task.toObject() };
    const updateData = { ...req.body };

    // Validate dueDate
    if (updateData.dueDate && isNaN(Date.parse(updateData.dueDate))) {
      return res.status(400).json({ message: 'Invalid due date format' });
    }

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    // Track changes for history
    if (oldTask.status !== updateData.status) {
      await History.create({
        taskId: task._id,
        userId: req.userId,
        action: 'STATUS_CHANGED',
        oldValue: oldTask.status,
        newValue: updateData.status
      });
    }

    if (oldTask.title !== updateData.title) {
      await History.create({
        taskId: task._id,
        userId: req.userId,
        action: 'TITLE_CHANGED',
        oldValue: oldTask.title,
        newValue: updateData.title
      });
    }

    if (oldTask.priority !== updateData.priority) {
      await History.create({
        taskId: task._id,
        userId: req.userId,
        action: 'PRIORITY_CHANGED',
        oldValue: oldTask.priority,
        newValue: updateData.priority
      });
    }

    Object.assign(task, updateData);
    await task.save();

    // Create notification if assigned
    if (task.assignedTo && task.assignedTo.toString() !== req.userId) {
      await Notification.create({
        userId: task.assignedTo,
        message: `Tarea actualizada: ${task.title}`,
        type: 'task_updated'
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Create history entry
    await History.create({
      taskId: task._id,
      userId: req.userId,
      action: 'DELETED',
      oldValue: task.title,
      newValue: ''
    });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// Search tasks
exports.searchTasks = async (req, res) => {
  try {
    const { searchText, status, priority, projectId } = req.query;
    const query = {};

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (projectId && projectId !== '0') query.projectId = projectId;

    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ message: 'Server error searching tasks' });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find();
    const now = new Date();

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completada').length,
      pending: tasks.filter(t => t.status !== 'Completada').length,
      highPriority: tasks.filter(t => t.priority === 'Alta' || t.priority === 'Crítica').length,
      overdue: tasks.filter(t => {
        if (!t.dueDate || t.status === 'Completada') return false;
        return new Date(t.dueDate) < now;
      }).length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
};
