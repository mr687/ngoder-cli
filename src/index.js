#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander');

const { handlerClockify } = require('./lib/handlers');
const { packageJson } = require('./config');

const main = async () => {
  program
    .version(packageJson.version)
    .usage('<cmd>|<option>');

  program
    .command('clockify')
    .alias('c')
    .description('Clockify CLI.')
    .option('-i, --init', 'Setting | update clockify configuration')
    .option('-s, --start', 'Start time tracker')
    .option('-x, --stop', 'Stop time tracker')
    .action(handlerClockify);

  await program.parseAsync(process.argv);
};

main();
