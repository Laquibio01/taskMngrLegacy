const History = require('../models/History');

// Get history by task ID
exports.getHistoryByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const history = await History.find({ taskId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

// Get all history
exports.getAllHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const history = await History.find()
      .populate('userId', 'username')
      .populate('taskId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(history);
  } catch (error) {
    console.error('Get all history error:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
};
