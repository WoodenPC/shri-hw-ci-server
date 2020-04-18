const builds = require('express').Router();

const serviceContainer = require('../../services/serviceContainer');

// получение списка сборок
builds.get('/', async (req, res) => {
  const { query } = req;
  let apiResponse;
  try {
    const yandexService = serviceContainer.getService('YandexService');
    apiResponse = await yandexService.getBuildsList({
      offset: query.offset,
      limit: query.limit,
    });
  } catch (e) {
    return res.status(500).send(e);
  }

  const { data } = apiResponse;

  if (data === undefined) {
    return res.status(500).send('Cannot get builds data from shri server!');
  }

  res.send({
    data: data.data,
  });
});

// добавление сборки в очередь
builds.post('/:commitHash', async (req, res) => {
  const { params } = req;
  const { commitHash } = params;

  if (commitHash === undefined) {
    return res.status(400).send('Commit hash param is required!');
  }
  const { body } = req;

  let apiResponse;
  try {
    const gitService = serviceContainer.getService('GitService');
    const yandexService = serviceContainer.getService('YandexService');
    //если каких то параметров нету, то берем инфу из гита
    if (!body.commitMessage || !body.branchName || !body.authorName) {
      const commitInfo = await gitService.getCommitInfo(commitHash);
      apiResponse = await yandexService.addBuildToQueue(commitInfo);
    } else {
      apiResponse = await yandexService.addBuildToQueue({
        commitHash,
        commitMessage: body.commitMessage || 'string',
        branchName: body.branchName || 'string',
        authorName: body.authorName || 'string',
      });
    }

    res.send(apiResponse.data);
  } catch (e) {
    return res.status(500).send(e);
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
    const yandexService = serviceContainer.getService('YandexService');
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
    const cacheService = serviceContainer.getService('CacheService');
    const yandexService = serviceContainer.getService('YandexService');
    const isValidLogCache = await cacheService.checkLog(buildId);
    if (isValidLogCache !== false) {
      console.log('cache exists');
      await cacheService.read(buildId, res);
      return;
    }

    const logs = await yandexService.getBuildLogs(buildId);
    if (logs.status !== 200) {
      return res.status(500).send('server error');
    }
    const { data } = logs;
    await cacheService.write(buildId, data);
    await cacheService.read(buildId, res);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = builds;
