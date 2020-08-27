/* eslint-disable no-console */
const inquirer = require('inquirer');
const chalk = require('chalk');
// const { exec } = require('child_process');
const branch = require('git-branch');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

const { config } = require('../config');
const clockify = require('../api/clockify');

const setInitClockify = async () => {
  const askApiKey = async () => inquirer.prompt([
    {
      type: 'input',
      message: 'Enter your clockify api key',
      name: 'apiKey',
      default: config.get('clockify.api_key') || '',
    },
  ]);
  const answerApiKey = await askApiKey();
  config.set('clockify.api_key', answerApiKey.apiKey);

  const user = await clockify.userInfo();
  config.set('clockify.user', user);
  console.info(chalk.blue(`🚀  You are logged in. Welcome, ${user.name}`));

  const workspaces = await clockify.workspaces();

  const askWorkspace = async () => inquirer.prompt([
    {
      type: 'list',
      message: 'Select a workspace',
      name: 'workspace',
      choices: () => {
        const list = [];
        workspaces.forEach((item, k) => list.push({
          name: `${k + 1}) ${item.name}`,
          value: item,
        }));
        return list;
      },
    },
  ]);
  const answerWorkspace = await askWorkspace();
  const { workspace } = answerWorkspace;

  config.set('clockify.workspace', workspace);

  const projects = await clockify.projects(workspace.id);
  const askProject = async () => inquirer.prompt([
    {
      type: 'list',
      message: 'Select a project',
      name: 'project',
      choices: () => {
        const list = [];
        projects.forEach((item, k) => list.push({
          name: `${k + 1}) ${item.name}`,
          value: item,
        }));
        return list;
      },
    },
  ]);
  const answerProject = await askProject();
  const { project } = answerProject;

  config.set('clockify.project', project);

  const tasks = await clockify.tasks(workspace.id, project.id);
  const askTask = async () => inquirer.prompt([
    {
      type: 'list',
      message: 'Select a project',
      name: 'task',
      choices: () => {
        const list = [];
        tasks.forEach((item, k) => list.push({
          name: `${k + 1}) ${item.name}`,
          value: item,
        }));
        return list;
      },
    },
  ]);
  const answerTask = await askTask();
  const { task } = answerTask;

  config.set('clockify.task', task);

  console.info(`\n🚀  ${chalk.blue('CLockify configuration updated')} !!`);
};

const startTimeTracker = async () => {
  const askSomeQuestion = async () => inquirer.prompt([
    {
      type: 'datetime',
      message: 'When you start ?',
      name: 'start',
      initial: new Date(),
    },
    {
      type: 'confirm',
      message: 'Would you like to billable ?',
      default: true,
      name: 'billable',
    },
    {
      type: 'input',
      message: 'Enter track description',
      name: 'description',
      default: (await branch()).toString(),
    },
  ]);

  const answer = await askSomeQuestion();
  await clockify.startTracker(answer);
};

const stopTimeTracker = async () => {
  const ask = async () => inquirer.prompt([
    {
      type: 'datetime',
      message: 'When you finish ?',
      name: 'end',
      initial: new Date(),
    },
  ]);

  const answer = await ask();
  await clockify.stopTracker(answer);
};

const updateTimeEntry = async () => {
  const timeEntries = await clockify.timeEntries(5);
  const ask = async () => inquirer.prompt([
    {
      name: 'time',
      message: 'Select time entry',
      type: 'list',
      choices: () => {
        const list = [];
        timeEntries.forEach((item, k) => list.push({
          name: `${k + 1}) ${item.description}`,
          value: item,
        }));
        return list;
      },
    },
  ]);

  const answer = await ask();
  const entry = answer.time;

  const askAction = async () => inquirer.prompt([
    {
      type: 'list',
      message: '',
      name: 'action',
      choices: ['update', 'delete'],
    },
  ]);

  const answerAction = await askAction();
  if (answerAction.action === 'update') {
    const askDesc = async () => inquirer.prompt([
      {
        type: 'input',
        message: 'Enter new description',
        name: 'desc',
        default: (await branch()).toString(),
      },
    ]);

    const answerDesc = await askDesc();
    const newData = entry;
    newData.description = answerDesc.desc;
    await clockify.updateTimeEntry(entry, newData);
  }
  if (answerAction.action === 'delete') {
    await clockify.deleteTimeEntry(entry);
  }
};

module.exports = {
  setInitClockify,
  startTimeTracker,
  stopTimeTracker,
  updateTimeEntry,
};
