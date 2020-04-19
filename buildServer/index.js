const express = require('express');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const https = require('https');
const axios = require('axios');

const svcContainer = require('./services/serviceContainer');
const ApiService = require('./services/apiService');
const AgentsService = require('./services/agentsService');

const configStr = readFileSync(resolve('./server-conf.json'), { encoding: 'utf8' });
const config = JSON.parse(configStr);

const axiosApi = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${config.apiToken}`,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

axiosApi.interceptors.response.use(null, (error) => {
  if (error.config && error.response && error.response.status >= 500) {
    return axiosApi.request(error.config);
  }
  return Promise.reject(error);
});

svcContainer.setService('ApiService', new ApiService(axiosApi));
svcContainer.setService('AgentsService', new AgentsService());

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/notify'));

app.listen(config.port, () => {
  console.log(`listening build server on port ${config.port}`);
})