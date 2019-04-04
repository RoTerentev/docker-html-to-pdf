const path = require('path');
const converter = require('./html-to-pdf-converter.js');

// PDF output filepath
const filebase = 'pdf-output';
const markup = {};

markup.html = `
<html lang="en">
<body>
<h1>Hi there! You got PDF from HTML, cheers!</h1>  
</body>
</html>
`;

let filepath = path.resolve(__dirname, `${filebase}.pdf`);
converter(filepath, markup).then((outpath) => {
  console.log(path.basename(outpath), 'is ready!');
});

markup.html = `
<html lang="en">
<body>
  <h1>Hi there! You got PDF from HTML with header and footer, cheers!</h1>  
</body>
</html>
`;

markup.header = `
<style>
  .header {
    width:100%;
    text-align: center;
    font-size: 10pt;
  }
</style>
<div class="header">
  I'm header
</div>
`;

markup.footer = `
<style>
  .footer {
    width:100%;
    text-align: center;
    font-size: 5pt;
  }
</style>
<div class="footer">
  I'm footer!
  <p> There is a puppeteer built in <span class="pageNumber"></span></p>
</div>
`;

// see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
const pdfOpts = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '20mm',
    left: '20mm',
    bottom: '20mm',
  },
};

filepath = path.resolve(__dirname, `${filebase}-hf.pdf`);
converter(filepath, markup, pdfOpts).then((outpath) => {
  console.log(path.basename(outpath), 'is ready!');
});
