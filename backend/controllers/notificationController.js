const Notification = require('../models/Notification');

// Get notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const { read } = req.query;
    const query = { userId: req.userId };

    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );

    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Mark notifications read error:', error);
    res.status(500).json({ message: 'Server error updating notifications' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error deleting notification' });
  }
};
