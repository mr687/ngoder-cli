/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const axios = require('axios');
const chalk = require('chalk');
const Clui = require('clui');

const { Spinner } = Clui;

const spinner = new Spinner(' Loading... ', ['😩', '👩‍🎤', '👢', '🚀', '💥', '🤬', '🏡']);

const { config } = require('../config');

const api = axios.create({
  baseURL: 'https://api.clockify.me/api/v1',
  headers: {
    'X-Api-Key': config.get('clockify.api_key'),
    'Content-Type': 'Application/json',
  },
});

api.interceptors.response.use((response) => {
  spinner.stop();
  return response;
}, (error) => {
  spinner.stop();
  if (error.response.status === 401) {
    console.error('[ERROR] Invalid API key 😩😩!!');
  }
  return Promise.reject(error);
});

api.interceptors.request.use((config) => {
  spinner.start();
  return config;
}, (error) => {
  spinner.stop();
  return Promise.reject(error);
});

const userInfo = async () => {
  config.get('clockify.api_key');
  const res = await api.get('/user');
  if (res.status === 200) {
    return res.data;
  }
};

const workspaces = async () => {
  const res = await api.get('/workspaces');
  if (res.status === 200) {
    return res.data;
  }
};

const projects = async (_workspaceId) => {
  const res = await api.get(`/workspaces/${_workspaceId}/projects`);
  if (res.status === 200) {
    return res.data;
  }
};

const tasks = async (_workspaceId, _projectId) => {
  const res = await api.get(`/workspaces/${_workspaceId}/projects/${_projectId}/tasks`);
  if (res.status === 200) {
    return res.data;
  }
};

const startTracker = async (obj) => {
  const data = {
    ...obj,
    ...{
      workspaceId: config.get('clockify.workspace.id'),
      projectId: config.get('clockify.project.id'),
      taskId: config.get('clockify.task.id'),
    },
  };
  const res = await api.post(`/workspaces/${data.workspaceId}/time-entries`, {
    start: data.start,
    billable: data.billable,
    description: data.description,
    projectId: data.projectId,
    taskId: data.taskId,
  });

  if (res.status === 201) {
    console.info(`🚀 ${chalk.blue('Time tracker started !')}`);
  }
};

const stopTracker = async (obj) => {
  const data = {
    ...obj,
    ...{
      workspaceId: config.get('clockify.workspace.id'),
    },
  };
  const user = await userInfo();
  const userId = user.id;
  const res = await api.patch(`/workspaces/${data.workspaceId}/user/${userId}/time-entries`, {
    end: data.end,
  });

  if (res.status === 201) {
    console.info(`😩 ${chalk.blue('Time tracker stopped !')}`);
  }
};

module.exports = {
  userInfo,
  workspaces,
  projects,
  tasks,
  startTracker,
  stopTracker,
};
