const HTMLtoPDF = require('../../model/htmlConverter.js');
const config = require('../../config.js');

module.exports = async (fastify) => {
  fastify.post('/html', async (request, reply) => {
    const pdfPuppeteerOpts = request.body.pdfOpts || config.PDF_OPTS;
    const { markup, header, footer } = request.body;

    if (header || footer) {
      pdfPuppeteerOpts.displayHeaderFooter = true;
      pdfPuppeteerOpts.headerTemplate = header || '';
      pdfPuppeteerOpts.footerTemplate = footer || '';
    }

    await HTMLtoPDF(markup, pdfPuppeteerOpts).then((pdfContentStream) => {
      reply.type('application/pdf; charset=utf-8').send(pdfContentStream);
    });
  });
};
