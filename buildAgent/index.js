const express = require('express');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { hostname } = require('os');

const axios = require('axios');

const svcContainer = require('./services/serviceContainer');
const ApiService = require('./services/apiService');
const BuildService = require('./services/buildService');

const configStr = readFileSync(resolve('./agent-conf.json'), { encoding: 'utf8' });
const config = JSON.parse(configStr);

const axiosApi = axios.create({
  baseURL: `http://${config.serverHost}:${config.serverPort}`
});

svcContainer.setService('ApiService',
  new ApiService(axiosApi, {
    host: '127.0.0.1',
    port: config.port,
    serverHost: config.serverHost,
    serverPort: config.serverPort
  }
));
svcContainer.setService('BuildService', new BuildService(resolve('../testRepos')));

const app = express();

process.on('uncaughtException', (err) => {
  console.log(err);
});

// инициализация сервера
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/build'));

app.listen(config.port, async () => {
  const apiSvc = svcContainer.getService('ApiService');
  await apiSvc.notifyAgent();
  console.log(`listening build agent on port ${config.port}`);
})