import axios from 'axios';
import https from 'https';

import axiosRetry from 'axios-retry';

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

axiosRetry(instance, {
  retries: 5,
  retryCondition: () => true,
  retryDelay: axiosRetry.exponentialDelay,
});

export { instance as axios };
