import express from 'express';

import { axios } from './axiosInstance';
import { router } from './routes';
import { GitService, IGitService } from 'services/gitService';
import { YandexService, IYandexService } from 'services/yandexService';
import { CacheService, ICacheService } from 'services/cacheService';
import { getServiceContainer } from 'services/serviceContainer';

const app = express();
// инициализция сервисов и сервис контейнера
const builLogsDir = process.env.CACHE_DIR || '/home/logsCache';

const gitSvc = new GitService();
const yandexSvc = new YandexService(axios);
const cacheSvc = new CacheService(builLogsDir);
const serviceContainer = getServiceContainer();
serviceContainer.setService<IGitService>('GitService', gitSvc);
serviceContainer.setService<IYandexService>('YandexService', yandexSvc);
serviceContainer.setService<ICacheService>('CacheService', cacheSvc);

// инициализация сервера
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

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
