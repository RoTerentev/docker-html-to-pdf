const path = require('path');
const os = require('os');
const hyperid = require('hyperid')({ urlSafe: true });

module.exports = () => path.format({
  dir: os.tmpdir(),
  name: hyperid(),
  ext: '.pdf',
});
