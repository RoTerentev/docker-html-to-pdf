require('make-promises-safe');
const fastify = require('fastify')({ logger: true });
const api = require('./api/v1');
const config = require('./config.js');

fastify.register(api, { prefix: '/v1' });

const start = async () => {
  try {
    await fastify.listen(config.PORT, config.IP_ADDR);
  } catch (err) {
    fastify.log.error(err);
    // exit
    throw err;
  }
};
start();
