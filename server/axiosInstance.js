const axios = require('axios');
const https = require('https');

const instance = axios.create({
  baseURL: 'https://hw.shri.yandex',
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

instance.interceptors.response.use(null, (error) => {
  if (error.config && error.response && error.response.status >= 500) {
    return instance.request(error.config);
  }
  return Promise.reject(error);
});

module.exports = instance;
