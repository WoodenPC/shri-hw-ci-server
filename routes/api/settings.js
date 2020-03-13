const settings = require('express').Router();

const axios = require('../../axios-instance');

// получение сохраненных настроек
settings.get('/', async (_, res, next) => {
  let apiResponse;
  try {
    apiResponse = await axios.get('/api/conf');
  } catch(e) {
    res.status(500).send(e);
    return next();
  }

  const { data } = apiResponse;
  if (data === undefined) {
    res.status(500).send('Cannot get configuration settings from api server!');
    return next();
  }

  res.send({
    id: data.id,
    repoName: data.repoName,
    buildCommand: data.buildCommand,
    mainBranch: data.mainBranch,
    period: data.period
  });
});

// cохранение настроек
settings.post('/', async (req, res, next) => {
  const { body } = req;
  let apiResponse;
  try {
    apiResponse = await axios.post('/api/conf', {
      repoName: body.repoName,
      buildCommand: body.buildCommand,
      mainBranch: body.mainBranch,
      period: body.period
    });
  } catch(e) {
    res.status(500).send(e);
    return next();
  }

  if (apiResponse.status !== 200) {
    res.status(500).send('Cannot save build configuration. Please check request params!');
    return next();
  }

  res.status(200);
});

module.exports = settings;