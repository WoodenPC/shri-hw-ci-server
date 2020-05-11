import axios from 'axios';

const instance = axios.create({
  baseURL: 'host.docker.internal:9999',
});

export { instance as axiosPush };
