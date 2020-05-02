import axios from 'axios';
import axiosRetry from 'axios-retry';

const instance = axios.create({
  baseURL: 'http://localhost:3000/backend',
  timeout: 40000,
});

axiosRetry(instance, {
  retries: 5,
  retryCondition: () => true,
  retryDelay: axiosRetry.exponentialDelay,
});

export { instance as axios };
