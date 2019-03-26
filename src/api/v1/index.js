const htmlHandler = require('./html.js');

module.exports = (fastify, opts, next) => {
  htmlHandler(fastify);
  next();
};
