import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/backend',
  timeout: 5000,
});

export { instance as axios };
