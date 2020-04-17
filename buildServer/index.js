const express = require('express');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/notify'));

const configStr = readFileSync(resolve('./server-conf.json'), { encoding: 'utf8' });
const config = JSON.parse(configStr);

app.listen(config.port, () => {
  console.log(`listening build server on port ${SERVER_PORT}`);
})