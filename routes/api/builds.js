
const builds = require('express').Router();


const yandexService = require('../../services/yandex-service');
const cacheService = require('../../services/cache-service');

// получение списка сборок
builds.get('/', async (req, res, next) => {
  const { params } = req;
  let apiResponse;
  try {
    apiResponse = await yandexService.getBuildsList(params);
  } catch(e) {
    res.status(500).send(e);
    return next();
  }

  const { data } = apiResponse;

  if (data === undefined) {
    res.status(500).send('Cannot get builds data from shri server!');
    return next();
  }

  res.send({
    data: data.data
  });
});

// добавление сборки в очередь
builds.post('/:commitHash', async (req, res, next) => {
  const { params } = req;
  const { commitHash } = params;

  if (commitHash === undefined) {
    res.status(400).send('Commit hash param is required!');
    return next();
  }
  const { body } = req;
  let apiResponse;
  try {
    apiResponse = await yandexService.addBuildToQueue(commitHash, {
      commitMessage: body.commitMessage,
      branchName: body.branchName,
      authorName: body.authorName
    });
  } catch(e) {
    res.send(500).send(e);
    return next();
  }

  const { data } = apiResponse;
  if (data === undefined) {
    res.send(500).send('Cannot add build to queue!');
    return next();
  }

  res.status(200).send('success');
});

// получение информации о конкретной сборке
builds.get('/:buildId', async (req, res, next) => {
  const { params } = req;
  const { buildId } = params;
  if (buildId === undefined) {
    res.status(400).send('buildId param is required!');
    return next();
  }

  let apiResponse;
  try {
    apiResponse = await yandexService.getBuildInfo(buildId);
  } catch(e) {
    res.status(500).send(e);
    return next();
  }

  const { data } = apiResponse;

  if (data === undefined) {
    res.status(500).send(`Cannot get build details for id = ${buildId} !`);
    return next();
  }

  res.send({
    data: data.data
  })
});

// получение логов билда (сплошной текст)
builds.get('/:buildId/logs', async (req, res, next) => {
  const { params } = req;
  const { buildId } = params;
  if (buildId === undefined) {
    res.status(400).send('buildId is required');
    return next();
  }

  try {
    await yandexService.getBuildLogs(buildId)
  } catch(e) {
    res.status(500).send(e);
    return next();
  }
});

module.exports = builds;