import { Router } from 'express';

import { getServiceContainer } from 'services/serviceContainer';
import { IYandexService } from 'services/yandexService';
import { IGitService } from 'services/gitService';

export const settings = Router();

// получение сохраненных настроек
settings.get('/', async (_, res) => {
  try {
    const serviceContainer = getServiceContainer();
    const yandexService = serviceContainer.getService<IYandexService>('YandexService');
    const apiResponse = await yandexService.getSavedSettings();
    const { data } = apiResponse;
    if (data === undefined) {
      return res.status(500).send('Cannot get configuration settings from api server!');
    }

    const settingsData = data.data;

    res.status(200).send(settingsData);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// cохранение настроек
settings.post('/', async (req, res) => {
  try {
    const { body } = req;
    const settings = {
      repoName: body.repoName,
      buildCommand: body.buildCommand,
      mainBranch: body.mainBranch,
      period: body.period,
    };

    const serviceContainer = getServiceContainer();
    const yandexService = serviceContainer.getService<IYandexService>('YandexService');
    const gitService = serviceContainer.getService<IGitService>('GitService');

    const apiResponse = await yandexService.saveSettings(settings);
    if (apiResponse.status !== 200) {
      return res.status(500).send('Cannot get data from yandex service');
    }
    const cloneResult = await gitService.init(settings);
    if (cloneResult === false) {
      return res.status(500).send(`Cannot clone repository with settings ${settings}`);
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
