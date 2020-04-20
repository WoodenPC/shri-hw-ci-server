const router = require('express').Router();

const svcContainer = require('../services/serviceContainer');

// зарегистрировать агента
router.post('/notify-agent', (req, res) => {
  const { body } = req;
  const { port, host } = body;
  const agentsSvc = svcContainer.getService('AgentsService');
  agentsSvc.register({ port, host: req.hostname });
  res.sendStatus(200);
});

// сохранить результаты сборки
router.post('/notify-build-result', async (req, res) => {
  const { body } = req;
  const { buildId, buildStatus, buildLog, duration } = body;
  const apiSvc = svcContainer.getService('ApiService');
  const agentsSvc = svcContainer.getService('AgentsService');
  try {
    const apiRes = await apiSvc.finishBuildAsync({
      buildId,
      success: buildStatus === 'Success',
      buildLog,
      duration
    });

    agentsSvc.unBindAgentByBuildId(buildId);

    console.log(apiRes.data);

    res.sendStatus(200);
  } catch(e) {
    res.status(500).send(`Cannot finish build ${e.toString()}`);
  }
});

module.exports = router;
