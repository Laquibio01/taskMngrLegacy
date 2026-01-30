const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = new Project({
      ...req.body,
      createdBy: req.userId
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'username');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error creating project', error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error updating project', error: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
