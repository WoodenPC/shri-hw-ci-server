const settings = require('express').Router();

const yandexService = require('../../services/yandex-service');
const gitService = require('../../services/git-service');

// получение сохраненных настроек
settings.get('/', async (_, res, next) => {
  let apiResponse;
  try {
    apiResponse = await yandexService.getSavedSettings();
  } catch(e) {
    return res.status(500).send(e);
  }

  const { data } = apiResponse;
  if (data === undefined) {
    return res.status(500).send('Cannot get configuration settings from api server!');
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
      return res.status(500).send(`Cannot clone repository with settings ${JSON.stringify(settings)}`);
    }
  } catch(e) {
    console.log(e);
    return res.status(500).json(e);
  }

  if (apiResponse.status !== 200) {
    return res.status(500).send('Cannot save build configuration. Please check request params!');
  }

  res.status(200).send('Success');
});

module.exports = settings;