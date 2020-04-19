const express = require('express');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const axios = require('axios');

const svcContainer = require('./services/serviceContainer');
const ApiService = require('./services/apiService');
const BuildService = require('./services/buildService');

const configStr = readFileSync(resolve('./agent-conf.json'), { encoding: 'utf8' });
const config = JSON.parse(configStr);

const axiosApi = axios.create({
  baseURL: `http://${config.serverHost}:${config.serverPort}`
});

svcContainer.setService('ApiService', new ApiService(axiosApi));
svcContainer.setService('BuildService', new BuildService(resolve('../testRepos')));

const app = express();

// инициализация сервера
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/build'));

app.listen(config.port, async () => {
  const apiSvc = svcContainer.getService('ApiService');
  const apiRes = await apiSvc.notifyAgent({ port: config.port, host: '127.0.0.1' });
  console.log(apiRes.data);
  console.log(`listening build agent on port ${config.port}`);
})