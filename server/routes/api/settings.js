const settings = require('express').Router();

const yandexService = require('../../services/yandex-service');
const gitService = require('../../services/git-service');

// получение сохраненных настроек
settings.get('/', async (_, res) => {
  let apiResponse;
  try {
    apiResponse = await yandexService.getSavedSettings();
  } catch (e) {
    return res.status(500).send(e);
  }

  const { data } = apiResponse;
  if (data === undefined) {
    return res.status(500).send('Cannot get configuration settings from api server!');
  }

  const settingsData = data.data;

  res.status(200).send({
    id: settingsData.id,
    repoName: settingsData.repoName,
    buildCommand: settingsData.buildCommand,
    mainBranch: settingsData.mainBranch,
    period: settingsData.period,
  });
});

// cохранение настроек
settings.post('/', async (req, res) => {
  const { body } = req;
  let apiResponse;
  console.log(body);
  try {
    const settings = {
      repoName: body.repoName,
      buildCommand: body.buildCommand,
      mainBranch: body.mainBranch,
      period: body.period,
    };

    apiResponse = await yandexService.saveSettings(settings);
    if (!apiResponse) {
      return res.status(500).send('error');
    }
    const cloneResult = await gitService.init(settings);
    if (cloneResult === false) {
      return res.status(500).send(`Cannot clone repository with settings ${JSON.stringify(settings)}`);
    }

    if (apiResponse.status !== 200) {
      return res.status(500).send('Cannot save build configuration. Please check request params!');
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }

  res.status(200).send('Success');
});

module.exports = settings;
