const router = require('express').Router();
const axios = require('axios');
const svcContainer = require('../services/serviceContainer');

// зарегистрировать агента
router.post('/notify-agent', (req, res) => {
  const { body } = req;
  const { port, host } = body;
  const agentsSvc = svcContainer.getService('AgentsService');
  agentsSvc.register({ port, host });
  res.sendStatus(200);
});

// сохранить результаты сборки
router.post('/notify-build-result', async (req, res) => {
  const { body } = req;
  const { buildId, buildStatus, buildLog, duration } = body;
  const apiSvc = svcContainer.getService('ApiService');
  const agentsSvc = svcContainer.getService('AgentsService');
  try {
    await apiSvc.finishBuildAsync({
      buildId,
      success: buildStatus === 'Success',
      buildLog,
      duration
    });
  } catch(e) {
    console.log(e);
    res.status(500).send(`Cannot finish build ${e.toString()}`);
  } finally {
    agentsSvc.unBindAgentByBuildId(buildId);
  }

  try {
    const buildDataRes = await apiSvc.getBuildData(buildId);
    const buildData = buildDataRes.data.data;
    console.log('sending build data to push server', buildId, JSON.stringify(buildData));
    if (buildData) {
      const pushRes = await axios.post('http://host.docker.internal:9999/push', {
        buildNumber: buildData.buildNumber,
        buildStatus
      });
      console.log('push response', pushRes.data);
    }

  } catch(e) {
    console.log(e.toString());
  }

  return res.sendStatus(200);
});

module.exports = router;
