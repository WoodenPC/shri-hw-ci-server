import axios from 'axios';
import https from 'https';

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

instance.interceptors.response.use(undefined, (error: any) => {
  if (error.config && error.response && error.response.status >= 500) {
    return instance.request(error.config);
  }
  return Promise.reject(error);
});

export { instance as axios };
