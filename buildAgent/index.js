const express = require('express');
const { resolve } = require('path');
const axios = require('axios');

const svcContainer = require('./services/serviceContainer');
const ApiService = require('./services/apiService');
const BuildService = require('./services/buildService');

const { env } = process;
const serverHost = env.serverHost || '127.0.0.1';
const serverPort = env.serverPort || 3000;
const port = env.port || 80;

const axiosApi = axios.create({
  baseURL: `http://${serverHost}:${serverPort}`
});

svcContainer.setService('ApiService',
  new ApiService(axiosApi, {
    host: env.host || '127.0.0.1',
    port: port,
    serverHost: serverHost,
    serverPort: serverPort
  }
));

svcContainer.setService('BuildService', new BuildService(resolve('/home/repos')));

const app = express();

process.on('uncaughtException', (err) => {
  console.log(err);
});

// инициализация сервера
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/build'));

app.listen(port, async () => {
  const apiSvc = svcContainer.getService('ApiService');
  await apiSvc.notifyAgent();
  console.log(`listening build agent on port ${port}`);
})