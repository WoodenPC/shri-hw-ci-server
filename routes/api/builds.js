
const builds = require('express').Router();

const axios = require('../../axios-instance');

// получение списка сборок
builds.get('/', async (req, res, next) => {
  const { params } = req;
  const apiResponse = await axios.get('/api/build/list', {
    params: {
      offset: params.offset || 0,
      limit: params.limit || 25
    }
  });

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
  const apiResponse = await axios.post('/api/build/request', {
    commitHash,
    commitMessage: body.commitMessage || '',
    branchName: body.branchName || '',
    authorName: body.authorName || ''
  });

  const { data } = apiResponse;
  if (data === undefined) {
    res.send(500).send('Cannot add build to queue!');
    return next();
  }

  res.status(200);
});

// получение информации о конкретной сборке
builds.get('/:buildId', async (req, res, next) => {
  const { params } = req;
  const { buildId } = params;
  if (buildId === undefined) {
    res.status(400).send('buildId param is required!');
    return next();
  }

  const apiResponse = await axios.get('/api/build/details', {
    params: {
      buildId
    }
  });

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
    res.status(400);
    return next();
  }

  await axios.get('/api/build/log', {
    params: {
      buildId
    }
  });
});


module.exports = builds;