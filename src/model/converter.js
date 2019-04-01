
const fs = require('fs-extra');
const config = require('../config.js');
const puppeteerPage = require('./page.js');
const tempFile = require('../utils/tempfile.js');

module.exports = async (html, puppeteerPDFOpts) => {
  const page = await puppeteerPage(html);

  const pdfPath = tempFile();

  const opts = puppeteerPDFOpts || config.PDF_OPTS;
  opts.path = pdfPath;


  await page
    .pdf(opts)
    .then(pdfBuffer => fs.writeFile(pdfPath, pdfBuffer));

  const rStream = fs.createReadStream(pdfPath);
  rStream.on('finish', () => {
    fs.unlink(pdfPath);
  });
  return page.browser().close().then(() => rStream);
};
