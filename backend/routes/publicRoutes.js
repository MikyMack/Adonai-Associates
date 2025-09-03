const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog');
const Project = require('../models/project');
const Testimonial = require('../models/Testimonial');


router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .limit(15);

        // Fetch latest 25 testimonials
        const testimonialsList = await Testimonial.find()
            .sort({ createdAt: -1 })
            .limit(25);

        // Fetch latest 3 blogs
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(3);

        res.render('index', { 
            title: 'Home',
            projects,
            testimonials: testimonialsList,
            blogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading home page data');
    }
});

router.get('/about', async (req, res) => {
    try {    
        res.render('about', { 
            title: 'About Us',    
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading about us page data');
    }
});
router.get('/blogs', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalBlogs = await Blog.countDocuments();

        res.render('blogs', { 
            title: 'Blogs',
            blogs: blogs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalBlogs / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading blogs page data');
    }
});


router.get('/contact', async (req, res) => {
    try {
        res.render('contact', { title: 'contact us'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});
router.get('/best-construction-company-kerala', async (req, res) => {
    try {
        res.render('best-construction-company-kerala', { title: 'best-construction-company-kerala'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});
router.get('/best-construction-company-trivandrum', async (req, res) => {
    try {
        res.render('best-construction-company-trivandrum', { title: 'best-construction-company-trivandrum'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});

router.get('/best-construction-company-kollam', async (req, res) => {
    try {
        res.render('best-construction-company-kollam', { title: 'best-construction-company-kollam'});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading contact page data');
    }
});

router.get('/services', async (req, res) => {
    try {
        res.render('services', {
            title: 'services'   
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }).lean();
        res.render('projects', {
            title: 'projects',
            projects: projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


router.get('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send('Blog ID is required');
        }

        const blog = await Blog.findById(id).lean();

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        const relatedBlogs = await Blog.find({ _id: { $ne: id } })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

        res.render('blogdetails', { 
            title: blog.title || 'Blog Details',
            blog: blog,
            relatedBlogs: relatedBlogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading blog details page data');
    }
});


module.exports = router;