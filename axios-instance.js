const axios = require('axios');
const https = require('https');

const instance = axios.create({
  baseURL: 'https://hw.shri.yandex',
  headers: {
    'Authorization': `Bearer ${process.env.AUTH_TOKEN}`
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

module.exports = instance;