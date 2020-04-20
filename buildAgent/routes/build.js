const router = require('express').Router();

const svcContainer = require('../services/serviceContainer');

// запустить сборку
router.post('/build', async (req, res) => {
  const { body } = req;
  const { buildId, repoAddress, commitHash, buildCommand } = body;
  const buildSvc = svcContainer.getService('BuildService');
  buildSvc.setParams({ buildId, repoAddress, commitHash, buildCommand });
  res.sendStatus(200);

  try {
    const processResult = await buildSvc.processRepository();
    console.log('build processing finished');
    const apiSvc = svcContainer.getService('ApiService');

    await apiSvc.notifyBuildResult({
      buildId,
      buildStatus: processResult.buildStatus,
      buildLog: processResult.buildLog,
      duration: processResult.duration
    });

    await apiSvc.notifyAgent();

  } catch(e) {
    console.log(e);
  }
})

module.exports = router;