const settings = require('express').Router();

const yandexService = require('../../services/yandex-service');
const gitService = require('../../services/git-service');

// получение сохраненных настроек
settings.get('/', async (_, res, next) => {
  let apiResponse;
  try {
    apiResponse = await yandexService.getSavedSettings();
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
    const settings = {
      repoName: body.repoName,
      buildCommand: body.buildCommand,
      mainBranch: body.mainBranch,
      period: body.period
    };

    apiResponse = await yandexService.saveSettings(settings);
    const cloneResult = await gitService.init(settings);
    if (cloneResult === false) {
      res.status(500).send(`Cannot clone repository with settings ${JSON.stringify(settings)}`);
      return next();
    }
  } catch(e) {
    console.log(e);
    res.status(500).json(e);
    return next();
  }

  if (apiResponse.status !== 200) {
    res.status(500).send('Cannot save build configuration. Please check request params!');
    return next();
  }

  res.status(200).send('Success');
});

module.exports = settings;