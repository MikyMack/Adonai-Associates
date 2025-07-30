const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogController');

const testimonialController = require('../controllers/testimonialController');

const upload = require('../utils/multer');
// Dynamic Multer middleware function
const axios = require('axios');
const {
    createProject,
    updateProject,
    deleteProject
  } = require('../controllers/projectController');
  
router.post('/projects', upload.array('images', 10), createProject);

// Update Project
router.put('/projects/:id', upload.array('images', 10), updateProject);

// Delete Project
router.delete('/projects/:id', deleteProject);

// 📰 Blogs Routes
router.post('/admin-blogs', upload.single('image'), blogController.createBlog);
router.get('/get-admin-blogs', blogController.getAllBlogs);
router.get('/admin-blogs/:id', blogController.getBlogById);
router.put('/admin-blogs/:id', upload.single('image'), blogController.updateBlog);
router.delete('/admin-blogs/:id', blogController.deleteBlog);

// Testimonials
router.post('/admin-testimonials', upload.single('image'), testimonialController.createTestimonial);
router.get('/testimonials', testimonialController.listTestimonials);
router.get('/admin-testimonials/:id', testimonialController.getTestimonialForEdit);
router.put('/admin-testimonials/:id', upload.single('image'), testimonialController.updateTestimonial);
router.delete('/admin-testimonials/:id', testimonialController.deleteTestimonial);
router.patch('/admin-testimonials/toggle-status/:id', testimonialController.toggleTestimonialStatus);

module.exports = router;
