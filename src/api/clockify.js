/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const chalk = require('chalk');

const { config } = require('../config');
const api = require('../lib/axios');

api.defaults.baseURL = 'https://api.clockify.me/api/v1';
api.defaults.headers.common['X-Api-Key'] = config.get('clockify.api_key');

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

const timeEntries = async (n) => {
  const workspaceId = config.get('clockify.workspace.id');
  const userId = config.get('clockify.user.id');

  const res = await api.get(`/workspaces/${workspaceId}/user/${userId}/time-entries`, {
    'page-size': n,
  });
  if (res.status === 200 || res.status === 201) {
    return res.data;
  }
};

const deleteTimeEntry = async (item) => {
  const workspaceId = config.get('clockify.workspace.id');
  const res = await api.delete(`/workspaces/${workspaceId}/time-entries/${item.id}`);
  if (res.status === 204) {
    console.info(`\n🚀  ${chalk.blue('Deleted successfully !!')}`);
  }
};

const updateTimeEntry = async (old, data) => {
  const workspaceId = config.get('clockify.workspace.id');
  const newData = {
    start: data.timeInterval.start,
    billable: data.billable,
    description: data.description,
    projectId: data.projectId,
    taskId: data.taskId,
    end: data.timeInterval.end,
  };
  const res = await api.put(`/workspaces/${workspaceId}/time-entries/${old.id}`, newData);

  if (res.status === 200) {
    console.info(`\n💥  ${chalk.blue('Updated successfully !!')}`);
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
    console.info(`\n🚀 ${chalk.blue('Time tracker started !')}`);
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

  if (res.status === 200) {
    console.info(`\n😩 ${chalk.blue('Time tracker stopped !')}`);
  }
};

module.exports = {
  userInfo,
  workspaces,
  projects,
  tasks,
  timeEntries,
  startTracker,
  stopTracker,
  updateTimeEntry,
  deleteTimeEntry,
};
