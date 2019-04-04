const fs = require('fs');
// eslint-disable-next-line
const request = require('http').request;

module.exports = (destFilePath, markup, puppeteerPDFOpts) => new Promise((resolve, reject) => {
  let body = {
    markup: markup.html,
  };

  if (markup.header) body.header = markup.header;
  if (markup.footer) body.footer = markup.footer;
  if (puppeteerPDFOpts) body.pdfOpts = puppeteerPDFOpts;

  body = JSON.stringify(body);

  const reqOpts = {
    port: 8765,
    path: '/v1/html',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = request(reqOpts, (res) => {
    const pdfStream = fs.createWriteStream(destFilePath);

    pdfStream
      .on('finish', () => {
        resolve(destFilePath);
      })
      .on('error', reject);

    res.pipe(pdfStream);
  });

  req.on('error', reject);
  req.write(body);
  req.end();
});
