const express = require('express');
const https = require('https');
const axios = require('axios');

const svcContainer = require('./services/serviceContainer');
const ApiService = require('./services/apiService');
const AgentsService = require('./services/agentsService');

const { env } = process;

const axiosApi = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Authorization: `Bearer ${env.apiToken}`,
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

process.on('uncaughtException', (err) => {
  console.error('Error!!!!! ', err.toString());
})

svcContainer.setService('ApiService', new ApiService(axiosApi));
svcContainer.setService('AgentsService', new AgentsService());

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/notify'));

app.listen(env.port, () => {
  console.log(`listening build server on port ${env.port}`);
})