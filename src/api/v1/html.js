const HTMLtoPDF = require('../../model/htmlConverter.js');
const config = require('../../config.js');

module.exports = async (fastify) => {
  fastify.post('/html', async (request, reply) => {
    const pdfPuppeteerOpts = request.body.pdfOpts || config.PDF_OPTS;
    await HTMLtoPDF(request.body.markup, pdfPuppeteerOpts).then((pdfContentStream) => {
      reply.type('application/pdf; charset=utf-8').send(pdfContentStream);
    });
  });
};
