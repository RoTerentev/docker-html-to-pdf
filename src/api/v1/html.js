const HTMLtoPDF = require('../../model/converter.js');

const pdfFromStreams = require('../../utils/mergePdf').fromStreams;
const config = require('../../config.js');

module.exports = async (fastify) => {
  fastify.post('/html', async (request, reply) => {
    const pdfPuppeteerOpts = request.body.pdfOpts || config.PDF_OPTS;
    const { markup, header, footer } = request.body;

    if (header || footer) {
      pdfPuppeteerOpts.displayHeaderFooter = true;
      pdfPuppeteerOpts.headerTemplate = header || '<span></span>';
      pdfPuppeteerOpts.footerTemplate = footer || '<span></span>';
    }

    if (request.query.noFirstHeader) {
      const titlePageOpts = Object.assign({}, pdfPuppeteerOpts, { headerTemplate: '<span></span>', pageRanges: '1' });
      const otherPagesOpts = Object.assign({}, pdfPuppeteerOpts, { pageRanges: '2-' });

      const [titlePage, otherPages] = await Promise.all([
        HTMLtoPDF(markup, titlePageOpts),
        HTMLtoPDF(markup, otherPagesOpts),
      ]);

      const pdfContentStream = await pdfFromStreams([titlePage, otherPages]);
      reply.type('application/pdf; charset=utf-8').send(pdfContentStream);
      return;
    }

    await HTMLtoPDF(markup, pdfPuppeteerOpts).then((_pdfContentStream) => {
      reply.type('application/pdf; charset=utf-8').send(_pdfContentStream);
    });
  });
};
