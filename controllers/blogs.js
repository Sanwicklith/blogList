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

blogsRouter.delete('/:id', async (req, res, next) => {
  const result = await Blog.findByIdAndDelete(req.params.id);

  if (!result) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({ error: 'Content missing' });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBlog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  res.status(200).json(updatedBlog);
});


module.exports = blogsRouter;
