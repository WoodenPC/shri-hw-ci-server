const express = require('express');

const app = express();

const axios = require('./axiosInstance');

const GitService = require('./services/gitService');
const YandexService = require('./services/yandexService');
const CacheService = require('./services/cacheService');
const serviceContainer = require('./services/serviceContainer');

// инициализция сервисов и сервис контейнера
const builLogsDir = process.env.CACHE_DIR || '/home/logsCache';

const gitSvc = new GitService();
const yandexSvc = new YandexService(axios);
const cacheSvc = new CacheService(builLogsDir);

serviceContainer.setService('GitService', gitSvc);
serviceContainer.setService('YandexService', yandexSvc);
serviceContainer.setService('CacheService', cacheSvc);

// инициализация сервера
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./routes'));

const SERVER_PORT = 5000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  next();
});

app.listen(SERVER_PORT, async () => {
  await gitSvc.loadSettingsFromYandexStorage();
  console.log(`listening on port ${SERVER_PORT}`);
});
