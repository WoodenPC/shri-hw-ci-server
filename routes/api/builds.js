const builds = require('express').Router();

const yandexService = require('../../services/yandex-service');
const cacheService = require('../../services/cache-service');

// получение списка сборок
builds.get('/', async (req, res) => {
  const { params } = req;
  let apiResponse;
  try {
    apiResponse = await yandexService.getBuildsList(params);
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
    apiResponse = await yandexService.addBuildToQueue({
      commitHash,
      commitMessage: body.commitMessage,
      branchName: body.branchName,
      authorName: body.authorName,
    });
  } catch (e) {
    return res.send(500).send(e);
  }

  res.status(200).send('success');
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
    const isValidLogCache = await cacheService.checkLog(buildId);
    if (isValidLogCache !== false) {
      console.log('cache exists');
      await cacheService.read(buildId, res);
      return;
    }

    const logs = await yandexService.getBuildLogs(buildId);
    if (logs.status !== 200) {
      return res.send(500);
    }
    const { data } = logs;
    await cacheService.write(buildId, data);
    await cacheService.read(buildId, res);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = builds;
