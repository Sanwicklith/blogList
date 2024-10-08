const logger = require('./logger')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  logger.info('___');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: 'invalid data' });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'invalid token' });
  } else if (err.name === 'RangeError' || err.name === 'TypeError') {
    return res.status(400).send({ error: 'invalid input' });
  } else if (err.name === 'MongoError') {
    return res.status(400).send({ error: 'database error' });
  } else {
    logger.error(err.message);
    return res.status(500).send({ error: 'something went wrong, try again later' });
  }
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const token = request.token;
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);
    request.user = user;
  }
  next();
};

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor };
