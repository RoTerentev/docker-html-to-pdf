const puppeteer = require('puppeteer-core');
const config = require('../config.js');

module.exports = async (html) => {
  const browser = await puppeteer.launch(config.LAUNCH_OPTS);
  const page = await browser.newPage();
  await page.setContent(html.toString('utf8'));
  await page.emulateMedia('screen');
  return page;
};
