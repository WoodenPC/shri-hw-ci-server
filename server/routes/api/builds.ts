import { Router } from 'express';

import { getServiceContainer } from 'services/serviceContainer';
import { IYandexService } from 'services/yandexService';
import { IGitService } from 'services/gitService';
import { ICacheService } from 'services/cacheService';

export const builds = Router();

// получение списка сборок
builds.get('/', async (req, res) => {
  try {
    const { query } = req;
    const serviceContainer = getServiceContainer();
    const yandexService = serviceContainer.getService<IYandexService>('YandexService');
    const apiResponse = await yandexService.getBuildList({
      offset: Number(query.offset),
      limit: Number(query.limit),
    });

    const { data } = apiResponse;
    if (data === undefined) {
      return res.status(500).send('Cannot get builds data from shri server!');
    }

    res.send({
      data: data.data,
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

// добавление сборки в очередь
builds.post('/:commitHash', async (req, res) => {
  const { params } = req;
  const { commitHash } = params;

  if (commitHash === undefined) {
    return res.status(400).send('Commit hash param is required!');
  }
  const { body } = req;
  try {
    const serviceContainer = getServiceContainer();
    const gitService = serviceContainer.getService<IGitService>('GitService');
    const yandexService = serviceContainer.getService<IYandexService>('YandexService');
    //если каких то параметров нету, то берем инфу из гита
    if (!body.commitMessage || !body.branchName || !body.authorName) {
      const commitInfo = await gitService.getCommitInfo(commitHash);
      if (commitInfo === undefined) {
        return res.sendStatus(500);
      }
      const apiResponse = await yandexService.addBuildToQueue(commitInfo);
      res.send(apiResponse.data);
    } else {
      const apiResponse = await yandexService.addBuildToQueue({
        commitHash,
        commitMessage: body.commitMessage,
        branchName: body.branchName,
        authorName: body.authorName,
      });

      res.send(apiResponse.data);
    }
  } catch (e) {
    return res.status(500).send('Cannot request build');
  }
});

// получение информации о конкретной сборке
builds.get('/:buildId', async (req, res) => {
  const { params } = req;
  const { buildId } = params;
  if (buildId === undefined) {
    return res.status(400).send('buildId param is required!');
  }

  let apiResponse;
  try {
    const serviceContainer = getServiceContainer();
    const yandexService = serviceContainer.getService<IYandexService>('YandexService');
    apiResponse = await yandexService.getBuildInfo(buildId);
  } catch (e) {
    return res.status(500).send(e);
  }

  const { data } = apiResponse;

  if (data === undefined) {
    return res.status(500).send(`Cannot get build details for id = ${buildId} !`);
  }

  res.send({
    data: data.data,
  });
});

// получение логов билда (сплошной текст)
builds.get('/:buildId/logs', async (req, res) => {
  const { params } = req;
  const { buildId } = params;
  if (buildId === undefined) {
    return res.status(400).send('buildId is required');
  }

  try {
    const serviceContainer = getServiceContainer();
    const cacheService = serviceContainer.getService('CacheService') as ICacheService;
    const yandexService = serviceContainer.getService('YandexService') as IYandexService;
    const isValidLogCache = await cacheService.checkLog(buildId);
    if (isValidLogCache !== false) {
      console.log('cache exists');
      await cacheService.read(buildId, res as any); // TODO:
      return;
    }

    const logs = await yandexService.getBuildLogs(buildId);
    if (logs.status !== 200) {
      return res.status(500).send('server error');
    }
    const { data } = logs;
    await cacheService.write(buildId, data as any);
    await cacheService.read(buildId, res as any); // TODO:
  } catch (e) {
    return res.status(500).send(e);
  }
});
