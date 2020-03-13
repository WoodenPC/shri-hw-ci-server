const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://hw.shri.yandex',
  headers: {
    'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
  },
  httpsAgent: {
    rejectUnauthorized: false
  }
});

module.exports = instance;