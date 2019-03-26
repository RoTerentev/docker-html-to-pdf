const puppeteerLaunchOpts = require('./puppeteer.launch.json');

puppeteerLaunchOpts.executablePath = process.env.CHROME_BIN;

module.exports = {
  PORT: process.env.PORT || 8765,
  ADDR: process.env.IP_ADDR || '0.0.0.0',
  LAUNCH_OPTS: puppeteerLaunchOpts,
  PDF_OPTS: {
    format: 'A4',
  },
};
