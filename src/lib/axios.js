/* eslint-disable no-console */
/* eslint-disable no-shadow */
const axios = require('axios');
const Clui = require('clui');

const { Spinner } = Clui;
const spinner = new Spinner(' Loading... ', ['😩', '👩‍🎤', '👢', '🚀', '💥', '🤬', '🏡']);

const api = axios.create();
api.defaults.headers.post['Content-Type'] = 'Application/json';

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

module.exports = api;
