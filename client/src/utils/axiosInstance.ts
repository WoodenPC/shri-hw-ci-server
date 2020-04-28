import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/backend',
  timeout: 20000,
});

instance.interceptors.response.use(undefined, (error) => {
  if (error.config && error.response && error.response.status >= 500) {
    return instance.request(error.config);
  }
  return Promise.reject(error);
});

export { instance as axios };
