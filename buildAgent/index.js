const express = require('express');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const app = express();

const configStr = readFileSync(resolve('./agent-conf.json'), { encoding: 'utf8' });
const config = JSON.parse(configStr);

// инициализация сервера
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes/build'));

app.listen(config.port, () => {
  console.log(`listening build agent on port ${SERVER_PORT}`);
})