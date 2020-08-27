/* eslint-disable no-console */

const clear = require('clear');
const inquirer = require('./inquirer');

const handlerClockify = async (obj) => {
  // clear();
  if (obj.init) await inquirer.setInitClockify();
  if (obj.start) await inquirer.startTimeTracker();
  if (obj.stop) await inquirer.stopTimeTracker();
  if (obj.change) await inquirer.updateTimeEntry();
};

module.exports = {
  handlerClockify,
};
