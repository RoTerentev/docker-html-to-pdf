const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const hyperid = require('hyperid')({ urlSafe: true });

const config = require('../config.js');

module.exports = async (html, puppeteerPDFOpts) => {
  const pdfPath = path.format({
    dir: os.tmpdir(),
    name: hyperid(),
    ext: '.pdf',
  });

  const opts = puppeteerPDFOpts || config.PDF_OPTS;
  opts.path = pdfPath;

  const browser = await puppeteer.launch(config.LAUNCH_OPTS);
  const page = await browser.newPage();
  await page.setContent(html.toString('utf8'));
  await page.emulateMedia('screen');
  await page
    .pdf(opts)
    .then(pdfBuffer => fs.writeFile(pdfPath, pdfBuffer));

  const rStream = fs.createReadStream(pdfPath);
  rStream.on('finish', () => {
    fs.unlink(pdfPath);
  });
  return browser.close().then(() => rStream);
};
