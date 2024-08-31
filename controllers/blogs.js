/**
 * Blog Router Module
 * 
 * This module handles all blog-related routes including:
 * - Fetching all blogs
 * - Creating a new blog
 * - Deleting a blog
 * - Updating a blog
 */

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
<<<<<<< HEAD
const middleware = require('../utils/middleware');
=======
const jwt = require('jsonwebtoken');
>>>>>>> 3a541ffcf1a666bc81090e3c5676f38a896a04e6

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

// POST a new blog
<<<<<<< HEAD
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
=======
blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
>>>>>>> 3a541ffcf1a666bc81090e3c5676f38a896a04e6

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// DELETE a blog by ID
<<<<<<< HEAD
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  const user = request.user;
  if (!user || blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'token missing or invalid' });
=======
blogsRouter.delete('/:id', async (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete blogs' });
>>>>>>> 3a541ffcf1a666bc81090e3c5676f38a896a04e6
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

// UPDATE a blog by ID
blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  // Validate request body
  if (!body) {
    return res.status(400).json({ error: 'Content missing' });
  }

  // Update blog and return updated version
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  // Check if blog exists
  if (!updatedBlog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
