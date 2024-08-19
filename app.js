const express = require('express');

const app = express();
const config = require('./utils/config');
const logger = require('./utils/logger');
const cors = require('cors');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('connect to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// middleware
app.use(express.json());
app.use(cors());
app.use(middleware.errorHandler);
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);
app.use(middleware.unknownEndpoint);

module.exports = app;
