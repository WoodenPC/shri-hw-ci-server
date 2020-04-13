const settings = require('express').Router();

const serviceContainer = require('../../services/serviceContainer');

// получение сохраненных настроек
settings.get('/', async (_, res) => {
  let apiResponse;
  try {
    const yandexService = serviceContainer.getService('YandexService');
    apiResponse = await yandexService.getSavedSettings();
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
  } catch (e) {
    return res.status(500).send(e);
  }
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

    const yandexService = serviceContainer.getService('YandexService');
    const gitService = serviceContainer.getService('GitService');

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
