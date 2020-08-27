const Configsore = require('configstore');
const packageJson = require('../package.json');

const defaultConf = {
  clockify: {
    api_key: null,
    user: null,
    workspace: null,
    project: null,
    task: null,
  },
};
const config = new Configsore(packageJson.name, defaultConf);

module.exports = {
  config,
  packageJson,
};
