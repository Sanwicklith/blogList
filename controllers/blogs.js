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
const jwt = require('jsonwebtoken');

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
blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// DELETE a blog by ID
blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user;

  if (!blog) {
    return response.status(404).end();
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' });
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
