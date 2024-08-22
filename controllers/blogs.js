const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
  const res = await Blog.find({});
  response.json(res);
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'Title or URL is missing' });
  }

  const blog = new Blog({
    title: body.title || 'Unknown',
    author: body.author,
    url: body.url,
    likes: body.likes || 0
    
  });
  const res = await blog.save();
  response.status(201).json(res);
});

module.exports = blogsRouter;
