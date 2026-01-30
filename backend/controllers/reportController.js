const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// Generate tasks report
exports.getTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find();
    const statusCount = {};

    tasks.forEach(task => {
      const status = task.status || 'Pendiente';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    res.json({
      type: 'tasks',
      data: statusCount,
      total: tasks.length
    });
  } catch (error) {
    console.error('Tasks report error:', error);
    res.status(500).json({ message: 'Server error generating report' });
  }
};

// Generate projects report
exports.getProjectsReport = async (req, res) => {
  try {
    const projects = await Project.find();
    const tasks = await Task.find();

    const report = projects.map(project => {
      const taskCount = tasks.filter(t => 
        t.projectId && t.projectId.toString() === project._id.toString()
      ).length;

      return {
        projectName: project.name,
        taskCount
      };
    });

    res.json({
      type: 'projects',
      data: report,
      total: projects.length
    });
  } catch (error) {
    console.error('Projects report error:', error);
    res.status(500).json({ message: 'Server error generating report' });
  }
};

// Generate users report
exports.getUsersReport = async (req, res) => {
  try {
    const users = await User.find();
    const tasks = await Task.find();

    const report = users.map(user => {
      const taskCount = tasks.filter(t => 
        t.assignedTo && t.assignedTo.toString() === user._id.toString()
      ).length;

      return {
        username: user.username,
        taskCount
      };
    });

    res.json({
      type: 'users',
      data: report,
      total: users.length
    });
  } catch (error) {
    console.error('Users report error:', error);
    res.status(500).json({ message: 'Server error generating report' });
  }
};

// Export tasks to CSV format
exports.exportTasksCSV = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name')
      .populate('assignedTo', 'username');

    let csv = 'ID,Título,Estado,Prioridad,Proyecto,Asignado a\n';

    tasks.forEach(task => {
      const projectName = task.projectId ? task.projectId.name : 'Sin proyecto';
      const assignedTo = task.assignedTo ? task.assignedTo.username : 'Sin asignar';
      csv += `${task._id},"${task.title}","${task.status || 'Pendiente'}","${task.priority || 'Media'}","${projectName}","${assignedTo}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export_tasks.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Server error exporting CSV' });
  }
};
