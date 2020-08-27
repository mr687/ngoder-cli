/* eslint-disable no-console */

const inquirer = require('./inquirer');

const handlerClockify = async (obj) => {
  if (obj.init) await inquirer.setInitClockify();
  if (obj.start) await inquirer.startTimeTracker();
  if (obj.stop) await inquirer.stopTimeTracker();
};

module.exports = {
  handlerClockify,
};
