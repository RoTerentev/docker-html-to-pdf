## Microservice based on Node.js and Puppeteer for converting a HTML markup to PDF

### Prerequisites

1. Installed Docker (https://docs.docker.com/)
1. Cloned repository

### Build image
On your host machine, go to the root of cloned project and run:
```bash
docker build -t <PREFER_IMAGE_NAME>:<TAG> ./
```
e.g.
```bash
docker build -t html2pdf:0.0.1 ./
```

Docker must create a new image: `html2pdf:0.0.1`

### Run container

To run a new container, you need to run:
```bash
docker run -d -p <HOST_PORT>:<SERVICE_PORT> <PREFER_IMAGE_NAME>:<TAG>
```
e.g.
```bash
docker run -d -p 8765:8765 html2pdf:0.0.1
```

Default _**SERVICE_PORT**_ value is `8765`, for change this you can use docker environment variable

```bash
docker run -d --env PORT=9999 -p 3030:9999 html2pdf:0.0.1
```

For more details about the Docker see the docs: https://docs.docker.com/reference/

### Usage

### Example
#### Node.js

_html-to-pdf-converter.js_
```javascript
const fse = require('fs-extra');
const request = require('http').request;

export default (destFilePath, markup, puppeteerPDFOpts) => new Promise((resolve, reject) => {
  let body = {
    markup: markup.html
  };

  if (markup.header) body.header = markup.header;
  if (markup.footer) body.footer = markup.footer;
  if (puppeteerPDFOpts) body.pdfOpts = puppeteerPDFOpts;

  body = JSON.stringify(body);

  const reqOpts = {
    port: 8765,
    path: '/v1/html?noFirstHeader=1',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = request(reqOpts, (res) => {
    const pdfStream = fse.createWriteStream(destFilePath);

    pdfStream
      .on('finish', () => {
        resolve(destFilePath);
      })
      .on('end', () => {
        resolve(destFilePath);
      })
      .on('error', reject);

    res.pipe(pdfStream);
  });

  req.on('error', reject);
  req.write(body);
  req.end();
});
```
