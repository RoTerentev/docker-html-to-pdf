const PDFMerge = require('pdf-merge');

const fs = require('fs-extra');
const tempFile = require('./tempfile.js');

module.exports = {
  fromStreams: (pdfContentStreams) => {
    const files = pdfContentStreams.map((fileReadbleStream) => {
      const filename = tempFile();
      const writeStream = fs.createWriteStream(filename);
      fileReadbleStream.pipe(writeStream);
      return filename;
    });

    return PDFMerge(files, { output: 'Stream' }).then((pdfStream) => {
      files.forEach((f) => {
        fs.unlink(f);
      });
      return pdfStream;
    });
  },
};
