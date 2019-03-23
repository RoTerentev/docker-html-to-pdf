require('make-promises-safe');
const fastify = require('fastify')({ logger: true });

const PORT = 3000;

fastify.get('/', async (request, reply) => ({ hello: 'world' }));

const start = async () => {
  try {
    await fastify.listen(PORT, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    // exit
    throw err;
  }
};
start();
