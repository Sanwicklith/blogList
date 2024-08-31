const express = require('express');
const app = express();
require('express-async-errors')
const config = require('./utils/config');
const logger = require('./utils/logger');
const cors = require('cors');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

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
<<<<<<< HEAD
app.use(middleware.tokenExtractor);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
=======
app.use('/api/blogs', blogsRouter);
>>>>>>> 3a541ffcf1a666bc81090e3c5676f38a896a04e6
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);

module.exports = app;
