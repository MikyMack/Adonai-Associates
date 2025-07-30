const Project = require('../models/project');
const { cloudinary } = require('../utils/cloudinary');

// Create Project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const project = new Project({ title, description, images });
    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Delete old images if new ones uploaded
    if (req.files.length > 0) {
      for (const img of project.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      project.images = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    project.title = title;
    project.description = description;

    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    if (typeof cloudinary !== 'undefined' && cloudinary.uploader && Array.isArray(project.images)) {
      for (const img of project.images) {
        if (img && img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (cloudErr) {
            console.error(`Error deleting image with public_id ${img.public_id}:`, cloudErr);
          }
        }
      }
    } else if (!cloudinary || !cloudinary.uploader) {
      console.error('cloudinary or cloudinary.uploader is undefined. Skipping image deletion.');
    }

    await Project.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
